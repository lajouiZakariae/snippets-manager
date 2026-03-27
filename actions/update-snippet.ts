'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UpdateSnippetSchema } from '@/lib/validations/snippet.schema';
import { SnippetsService } from '@/lib/services/snippets.service';

export async function updateSnippet(id: string, prevState: unknown, formData: FormData) {
    const raw = formData.get('__json');
    if (!raw || typeof raw !== 'string') {
        return { success: false, errors: { _form: ['Invalid form data'] } };
    }

    const parsed = UpdateSnippetSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    try {
        await SnippetsService.update(id, parsed.data);
    } catch (err) {
        return { success: false, errors: { _form: [(err as Error).message] } };
    }

    revalidatePath('/protected/snippets');
    revalidatePath(`/protected/snippets/${id}`);
    redirect(`/protected/snippets/${id}`);
}
