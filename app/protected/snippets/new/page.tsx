import { BackButton } from '@/components/back-button';
import { SnippetForm } from '@/components/snippets/snippet-form';
import { TagsService } from '@/lib/services/tags.service';

export default async function NewSnippetPage() {
    const allTags = await TagsService.getAll();

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
                <BackButton url="/protected/snippets" />

                <h1 className="text-2xl font-bold tracking-tight">New Snippet</h1>
            </div>
            <SnippetForm mode="create" allTags={allTags} />
        </div>
    );
}
