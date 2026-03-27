'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CodeSnippetSummary } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { SnippetCardMenu } from './snippet-card-menu';

type Props = {
    snippet: CodeSnippetSummary;
};

export function SnippetCard({ snippet }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <Card className={isDeleting ? 'pointer-events-none opacity-50' : ''}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <Link href={`/protected/snippets/${snippet.id}`} className="line-clamp-2 text-base leading-tight font-semibold hover:underline">
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
                <div className="mb-3 flex flex-wrap gap-1">
                    {snippet.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.title}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}</span>
                    <span>
                        {snippet.block_count} {snippet.block_count === 1 ? 'block' : 'blocks'}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
