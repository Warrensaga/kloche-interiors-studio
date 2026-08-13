import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Returns an error message when the file is not an acceptable image. */
export function validateImage(file: File): string | null {
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const typeOk = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type);
  const extOk = (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
  if (!typeOk && !extOk) return `${file.name}: only JPG, PNG or WEBP images are allowed.`;
  if (file.size > MAX_FILE_BYTES)
    return `${file.name}: ${formatBytes(file.size)} exceeds the ${formatBytes(MAX_FILE_BYTES)} limit.`;
  if (file.size === 0) return `${file.name}: file is empty.`;
  return null;
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
