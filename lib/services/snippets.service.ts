import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type {
  CodeSnippet,
  CodeSnippetSummary,
  SnippetFilters,
} from "@/lib/types";
import type {
  CreateSnippetInput,
  UpdateSnippetInput,
} from "@/lib/validations/snippet.schema";
import { BlocksService } from "./blocks.service";
import { TagsService } from "./tags.service";

export class SnippetsService {
  static async getAll(
    filters: SnippetFilters = {},
  ): Promise<CodeSnippetSummary[]> {
    const supabase = await createClient();

    let query = supabase
      .from("code_snippets")
      .select(
        `
                id,
                title,
                created_at,
                visibility,
                share_token,
                code_snippet_tags ( tag_id, tags ( id, title, created_at ) ),
                code_blocks ( language )
            `,
      )
      .order("created_at", { ascending: false });

    if (filters.title) {
      query = query.ilike("title", `%${filters.title}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    let summaries: CodeSnippetSummary[] = (data ?? []).map((row: any) => {
      const tags = (row.code_snippet_tags ?? [])
        .map((cst: any) => cst.tags)
        .filter(Boolean);
      const allLanguages: string[] = (row.code_blocks ?? []).map(
        (b: any) => b.language,
      );
      const languages = [...new Set(allLanguages)];
      return {
        id: row.id,
        title: row.title,
        created_at: row.created_at,
        visibility: row.visibility,
        share_token: row.share_token,
        tags,
        block_count: (row.code_blocks ?? []).length,
        languages,
      };
    });

    // Filter by language (client-side since we need distinct languages per snippet)
    if (filters.language) {
      summaries = summaries.filter((s) =>
        s.languages.includes(filters.language!),
      );
    }

    // Filter by tag
    if (filters.tagId) {
      summaries = summaries.filter((s) =>
        s.tags.some((t) => t.id === filters.tagId),
      );
    }

    return summaries;
  }

  static async getById(id: string): Promise<CodeSnippet> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("code_snippets")
      .select(
        `
                id,
                title,
                created_at,
                visibility,
                share_token,
                code_snippet_tags ( tag_id, tags ( id, title, created_at ) ),
                code_blocks ( id, snippet_id, title, description, code, language, position, created_at )
            `,
      )
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    const tags = (data.code_snippet_tags ?? [])
      .map((cst: any) => cst.tags)
      .filter(Boolean);
    const code_blocks = [...(data.code_blocks ?? [])].sort(
      (a: any, b: any) => a.position - b.position,
    );

    return {
      id: data.id,
      title: data.title,
      created_at: data.created_at,
      visibility: data.visibility,
      share_token: data.share_token,
      tags,
      code_blocks,
    };
  }

  static async create(input: CreateSnippetInput): Promise<CodeSnippet> {
    const supabase = await createClient();

    // Insert snippet
    const { data: snippet, error: snippetError } = await supabase
      .from("code_snippets")
      .insert({ title: input.title, visibility: input.visibility })
      .select()
      .single();

    if (snippetError) throw new Error(snippetError.message);

    // Upsert tags and link them
    if (input.tags && input.tags.length > 0) {
      const tags = await Promise.all(
        input.tags.map((t) => TagsService.upsert(t)),
      );
      const pivotRows = tags.map((t) => ({
        snippet_id: snippet.id,
        tag_id: t.id,
      }));
      const { error: pivotError } = await supabase
        .from("code_snippet_tags")
        .insert(pivotRows);
      if (pivotError) throw new Error(pivotError.message);
    }

    // Insert blocks
    await BlocksService.replaceForSnippet(snippet.id, input.blocks);

    return SnippetsService.getById(snippet.id);
  }

  static async update(
    id: string,
    input: UpdateSnippetInput,
  ): Promise<CodeSnippet> {
    const supabase = await createClient();

    // Update snippet title
    const { error: updateError } = await supabase
      .from("code_snippets")
      .update({ title: input.title, visibility: input.visibility })
      .eq("id", id);

    if (updateError) throw new Error(updateError.message);

    // Replace tag associations
    const { error: deleteTagsError } = await supabase
      .from("code_snippet_tags")
      .delete()
      .eq("snippet_id", id);

    if (deleteTagsError) throw new Error(deleteTagsError.message);

    if (input.tags && input.tags.length > 0) {
      const tags = await Promise.all(
        input.tags.map((t) => TagsService.upsert(t)),
      );
      const pivotRows = tags.map((t) => ({ snippet_id: id, tag_id: t.id }));
      const { error: pivotError } = await supabase
        .from("code_snippet_tags")
        .insert(pivotRows);
      if (pivotError) throw new Error(pivotError.message);
    }

    // Replace blocks
    await BlocksService.replaceForSnippet(id, input.blocks);

    return SnippetsService.getById(id);
  }

  static async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("code_snippets")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  static async getDistinctLanguages(): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("code_blocks")
      .select("language");
    if (error) throw new Error(error.message);
    return [
      ...new Set((data ?? []).map((r: any) => r.language as string)),
    ].sort();
  }

  static async getByShareToken(token: string): Promise<CodeSnippet> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("code_snippets")
      .select(
        `
                id,
                title,
                created_at,
                visibility,
                share_token,
                code_snippet_tags ( tag_id, tags ( id, title, created_at ) ),
                code_blocks ( id, snippet_id, title, description, code, language, position, created_at )
            `,
      )
      .eq("share_token", token)
      .eq("visibility", "public")
      .single();

    if (error) throw new Error(error.message);

    const tags = (data.code_snippet_tags ?? [])
      .map((cst: any) => cst.tags)
      .filter(Boolean);
    const code_blocks = [...(data.code_blocks ?? [])].sort(
      (a: any, b: any) => a.position - b.position,
    );

    return {
      id: data.id,
      title: data.title,
      created_at: data.created_at,
      visibility: data.visibility,
      share_token: data.share_token,
      tags,
      code_blocks,
    };
  }
}
