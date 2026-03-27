import { SnippetsPage } from '@/components/snippets/snippets-page';
import { Skeleton } from '@/components/ui/skeleton';
import type { SnippetFilters } from '@/lib/types';
import { Suspense } from 'react';

type Props = {
    searchParams: Promise<{ title?: string; language?: string; tagId?: string }>;
};

function SnippetsPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-9 w-36" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-44 rounded-lg" />
                ))}
            </div>
        </div>
    );
}

export default async function SnippetsListPage({ searchParams }: Props) {
    const params = await searchParams;
    const filters: SnippetFilters = {
        title: params.title,
        language: params.language,
        tagId: params.tagId,
    };

    return (
        <Suspense fallback={<SnippetsPageSkeleton />}>
            <SnippetsPage filters={filters} />
        </Suspense>
    );
}
