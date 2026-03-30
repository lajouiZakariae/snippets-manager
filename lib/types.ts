import { SnippetVisibility } from "./enums";

export type Tag = {
  id: string;
  title: string;
  created_at: string;
};

export type CodeBlock = {
  id: string;
  snippet_id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  position: number;
  created_at: string;
};

export type CodeSnippet = {
  id: string;
  title: string;
  created_at: string;
  visibility: SnippetVisibility;
  share_token: string;
  tags: Tag[];
  code_blocks: CodeBlock[];
};

// Lightweight version used in the listing grid (no full block code)
export type CodeSnippetSummary = {
  id: string;
  title: string;
  created_at: string;
  visibility: SnippetVisibility;
  share_token: string;
  tags: Tag[];
  block_count: number;
  languages: string[]; // distinct languages across all blocks
};

export type SnippetFilters = {
  title?: string;
  language?: string;
  tagId?: string;
};

export type ActionState =
  | { success: true }
  | { success: false; errors: Record<string, string[]> }
  | null;
