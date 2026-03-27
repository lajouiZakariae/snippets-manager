'use server';

import { SnippetsService } from '@/lib/services/snippets.service';
import { CreateSnippetSchema } from '@/lib/validations/snippet.schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSnippet(prevState: unknown, formData: FormData) {
    const raw = formData.get('__json');
    if (!raw || typeof raw !== 'string') {
        return { success: false, errors: { _form: ['Invalid form data'] } };
    }

    const parsed = CreateSnippetSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    let newId: string;
    try {
        const snippet = await SnippetsService.create(parsed.data);
        newId = snippet.id;
    } catch (err) {
        return { success: false, errors: { _form: [(err as Error).message] } };
    }

    revalidatePath('/protected/snippets');
    redirect(`/protected/snippets/${newId}`);
}
