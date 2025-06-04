import { supabase } from "./supabaseClient";

export async function uploadImageToSupabase(
  file: File,
  folder = "avatars"
): Promise<{ url: string | null; error: string | null }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `${process.env.NEXT_PUBLIC_SUPABASE_FILE_PATH!}/${fileName}`

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error.message);
    return { url: null, error: error.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
    .getPublicUrl(filePath);

  return { url: publicUrlData?.publicUrl ?? null, error: null };
}
