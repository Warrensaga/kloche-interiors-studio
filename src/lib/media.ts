import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Formats browsers can render directly — uploaded untouched. */
export const WEB_SAFE_TYPES = [
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
] as const;

/** Formats we accept but convert to WEBP in the browser before upload. */
export const CONVERTIBLE_TYPES = [
  "image/heic",
  "image/heif",
  "image/tiff",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/jp2",
] as const;

export const ALLOWED_IMAGE_TYPES = [...WEB_SAFE_TYPES, ...CONVERTIBLE_TYPES] as const;

export const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "jpe",
  "png",
  "webp",
  "avif",
  "gif",
  "svg",
  "heic",
  "heif",
  "tif",
  "tiff",
  "bmp",
  "ico",
  "jp2",
] as const;

/** `accept` attribute shared by every admin file input. */
export const IMAGE_ACCEPT = `${ALLOWED_IMAGE_TYPES.join(",")},${ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",")}`;

export const ALLOWED_LABEL = "JPG, PNG, WEBP, AVIF, GIF, SVG, HEIC, TIFF, BMP or ICO";

export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extOf(name: string) {
  return (name.split(".").pop() ?? "").toLowerCase();
}

function needsConversion(file: File) {
  const ext = extOf(file.name);
  if ((CONVERTIBLE_TYPES as readonly string[]).includes(file.type)) return true;
  if ((WEB_SAFE_TYPES as readonly string[]).includes(file.type)) return false;
  return ["heic", "heif", "tif", "tiff", "bmp", "ico", "jp2"].includes(ext);
}

/** Returns an error message when the file is not an acceptable image. */
export function validateImage(file: File): string | null {
  const ext = extOf(file.name);
  const typeOk = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type);
  const extOk = (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
  const genericImage = file.type.startsWith("image/");
  if (!typeOk && !extOk && !genericImage)
    return `${file.name}: unsupported file. Use ${ALLOWED_LABEL}.`;
  if (file.size > MAX_FILE_BYTES)
    return `${file.name}: ${formatBytes(file.size)} exceeds the ${formatBytes(MAX_FILE_BYTES)} limit.`;
  if (file.size === 0) return `${file.name}: file is empty.`;
  return null;
}

/**
 * Normalise exotic formats (HEIC/TIFF/BMP/ICO) to WEBP so every uploaded
 * image renders in all browsers. Web-safe formats pass through untouched.
 */
export async function prepareImage(file: File): Promise<File> {
  if (typeof window === "undefined" || !needsConversion(file)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas context");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.92),
    );
    if (!blob) throw new Error("conversion failed");
    const name = `${file.name.replace(/\.[^.]+$/, "")}.webp`;
    return new File([blob], name, { type: "image/webp" });
  } catch {
    throw new Error(
      `${file.name}: this format can't be read by your browser. Please convert it to JPG, PNG or WEBP first.`,
    );
  }
}


/** Build a clean, collision-free storage filename. */
export function buildStoragePath(fileName: string, folder: string) {
  const ext = (fileName.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const base =
    fileName
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "image";
  const stamp = new Date().toISOString().slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${folder}/${stamp}-${base}-${rand}.${ext}`;
}

/** Upload with real progress via the Storage REST endpoint (XHR supports progress events). */
function uploadWithProgress(
  path: string,
  file: File,
  token: string,
  onProgress?: (pct: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/media/${path}`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "31536000");
    if (file.type) xhr.setRequestHeader("content-type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else {
        let msg = `Upload failed (${xhr.status}).`;
        try {
          const parsed = JSON.parse(xhr.responseText);
          if (parsed?.message) msg = parsed.message;
        } catch {
          /* keep default */
        }
        reject(new Error(msg));
      }
    };
    xhr.send(file);
  });
}

/** Upload a file to the private media bucket and record it in the library. */
export async function uploadMedia(
  file: File,
  folder = "uploads",
  onProgress?: (pct: number) => void,
) {
  const invalid = validateImage(file);
  if (invalid) throw new Error(invalid);

  const path = buildStoragePath(file.name, folder);

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("You must be signed in to upload images.");

  await uploadWithProgress(path, file, token, onProgress);

  const { data: signed, error: signErr } = await supabase.storage
    .from("media")
    .createSignedUrl(path, TEN_YEARS);
  if (signErr) throw signErr;

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      name: file.name,
      path,
      url: signed.signedUrl,
      folder,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMedia(id: string, path: string) {
  await supabase.storage.from("media").remove([path]);
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw error;
}
