import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/lib/types";
import { AuthUserService } from "./auth-user-service";

export class TagsService {
  static async getAll(): Promise<Tag[]> {
    const authUser = await AuthUserService.getAuthUserOrRedirect();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tags")
      .select(
        "id, title, created_at, code_snippet_tags!inner(snippet_id, code_snippets!inner(user_id))",
      )
      .eq("code_snippet_tags.code_snippets.user_id", authUser.sub)
      .order("title", { ascending: true });

    if (error) throw new Error(error.message);

    const seen = new Set<string>();
    return (data ?? [])
      .filter((row) => {
        if (seen.has(row.id)) return false;
        seen.add(row.id);
        return true;
      })
      .map((row) => ({
        id: row.id,
        title: row.title,
        created_at: row.created_at,
      }));
  }

  static async upsert(title: string): Promise<Tag> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tags")
      .upsert({ title }, { onConflict: "title" })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async deleteIfOrphan(tagId: string): Promise<void> {
    const supabase = await createClient();
    const { count, error: countError } = await supabase
      .from("code_snippet_tags")
      .select("*", { count: "exact", head: true })
      .eq("tag_id", tagId);

    if (countError) throw new Error(countError.message);

    if (count === 0) {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);
      if (error) throw new Error(error.message);
    }
  }
}
