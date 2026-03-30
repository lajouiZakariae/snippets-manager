"use server";

import { SnippetVisibility } from "@/lib/enums";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setSnippetVisibility(
  id: string,
  visibility: SnippetVisibility,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("code_snippets")
    .update({ visibility })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/protected/snippets");
  revalidatePath(`/protected/snippets/${id}`);
}
