import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SnippetCard } from './snippet-card';
import type { CodeSnippetSummary } from '@/lib/types';

type Props = {
    snippets: CodeSnippetSummary[];
};

export function SnippetsListing({ snippets }: Props) {
    if (snippets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <Code2 className="h-12 w-12 text-muted-foreground" />
                <div>
                    <p className="text-lg font-medium">No snippets found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create your first snippet to get started.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/protected/snippets/new">Create your first snippet</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
        </div>
    );
}
