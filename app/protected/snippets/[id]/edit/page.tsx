import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        [snippet, allTags] = await Promise.all([
            SnippetsService.getById(id),
            TagsService.getAll(),
        ]);
    } catch {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/protected/snippets/${id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Edit Snippet</h1>
            </div>
            <SnippetForm mode="edit" snippet={snippet} allTags={allTags} />
        </div>
    );
}
