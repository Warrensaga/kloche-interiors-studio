import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Upload a file to the private media bucket and record it in the library. */
export async function uploadMedia(file: File, folder = "uploads") {
  const ext = file.name.split(".").pop() ?? "jpg";
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const path = `${folder}/${Date.now()}-${safe || "file"}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("media")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (upErr) throw upErr;

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
