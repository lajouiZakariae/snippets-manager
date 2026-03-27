'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SnippetCardMenu } from './snippet-card-menu';
import type { CodeSnippetSummary } from '@/lib/types';

type Props = {
    snippet: CodeSnippetSummary;
};

export function SnippetCard({ snippet }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <Card className={isDeleting ? 'opacity-50 pointer-events-none' : ''}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <Link
                        href={`/protected/snippets/${snippet.id}`}
                        className="font-semibold text-base leading-tight hover:underline line-clamp-2"
                    >
                        {snippet.title}
                    </Link>
                    <SnippetCardMenu snippet={snippet} onDeleteStart={() => setIsDeleting(true)} />
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                    {snippet.languages.map((lang) => (
                        <Badge key={lang} className="text-xs">
                            {lang}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-3">
                    {snippet.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.title}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                    <span>{formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}</span>
                    <span>{snippet.block_count} {snippet.block_count === 1 ? 'block' : 'blocks'}</span>
                </div>
            </CardContent>
        </Card>
    );
}
