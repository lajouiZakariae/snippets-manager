import { createClient } from '@/lib/supabase/server';
import type { Tag } from '@/lib/types';

export class TagsService {
    static async getAll(): Promise<Tag[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .order('title', { ascending: true });

        if (error) throw new Error(error.message);
        return data ?? [];
    }

    static async upsert(title: string): Promise<Tag> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('tags')
            .upsert({ title }, { onConflict: 'title' })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
}
