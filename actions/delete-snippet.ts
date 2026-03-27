'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SnippetsService } from '@/lib/services/snippets.service';

export async function deleteSnippet(id: string) {
    try {
        await SnippetsService.delete(id);
    } catch (err) {
        throw new Error((err as Error).message);
    }

    revalidatePath('/protected/snippets');
    redirect('/protected/snippets');
}
