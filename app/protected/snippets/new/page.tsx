import { SnippetForm } from '@/components/snippets/snippet-form';
import { Button } from '@/components/ui/button';
import { TagsService } from '@/lib/services/tags.service';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewSnippetPage() {
    const allTags = await TagsService.getAll();

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/protected/snippets">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">New Snippet</h1>
            </div>
            <SnippetForm mode="create" allTags={allTags} />
        </div>
    );
}
