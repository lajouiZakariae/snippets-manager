import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SnippetsFilters } from './snippets-filters';
import { SnippetsListing } from './snippets-listing';
import { SnippetsService } from '@/lib/services/snippets.service';
import { TagsService } from '@/lib/services/tags.service';
import type { SnippetFilters } from '@/lib/types';
import { Suspense } from 'react';

type Props = {
    filters: SnippetFilters;
};

export async function SnippetsPage({ filters }: Props) {
    const [snippets, languages, tags] = await Promise.all([
        SnippetsService.getAll(filters),
        SnippetsService.getDistinctLanguages(),
        TagsService.getAll(),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Snippets</h1>
                <Button asChild>
                    <Link href="/protected/snippets/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Snippet
                    </Link>
                </Button>
            </div>

            <Suspense>
                <SnippetsFilters languages={languages} tags={tags} />
            </Suspense>

            <SnippetsListing snippets={snippets} />
        </div>
    );
}
