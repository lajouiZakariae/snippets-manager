'use server';

import { SnippetsService } from '@/lib/services/snippets.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteSnippet(id: string) {
    try {
        await SnippetsService.delete(id);
    } catch (err) {
        throw new Error((err as Error).message);
    }

    revalidatePath('/protected/snippets');
    redirect('/protected/snippets');
}
