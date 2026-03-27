import { BackButton } from '@/components/back-button';
import { SnippetForm } from '@/components/snippets/snippet-form';
import { SnippetsService } from '@/lib/services/snippets.service';
import { TagsService } from '@/lib/services/tags.service';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditSnippetPage({ params }: Props) {
    const { id } = await params;

    let snippet, allTags;
    try {
        [snippet, allTags] = await Promise.all([SnippetsService.getById(id), TagsService.getAll()]);
    } catch {
        notFound();
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
                <BackButton url={`/protected/snippets/${id}`} />

                <h1 className="text-2xl font-bold tracking-tight">Edit Snippet</h1>
            </div>
            <SnippetForm mode="edit" snippet={snippet} allTags={allTags} />
        </div>
    );
}
