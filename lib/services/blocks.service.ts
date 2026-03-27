import { createClient } from '@/lib/supabase/server';
import type { CodeBlock } from '@/lib/types';
import type { BlockInput } from '@/lib/validations/snippet.schema';

export class BlocksService {
    static async replaceForSnippet(snippetId: string, blocks: BlockInput[]): Promise<CodeBlock[]> {
        const supabase = await createClient();

        // Delete all existing blocks for this snippet
        const { error: deleteError } = await supabase.from('code_blocks').delete().eq('snippet_id', snippetId);

        if (deleteError) throw new Error(deleteError.message);

        if (blocks.length === 0) return [];

        // Insert new blocks
        const rows = blocks.map((block, index) => ({
            snippet_id: snippetId,
            title: block.title,
            description: block.description ?? null,
            code: block.code,
            language: block.language,
            position: block.position ?? index,
        }));

        const { data, error: insertError } = await supabase.from('code_blocks').insert(rows).select();

        if (insertError) throw new Error(insertError.message);
        return data ?? [];
    }
}
