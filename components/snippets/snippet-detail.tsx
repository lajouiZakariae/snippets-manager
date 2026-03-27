import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CodeSnippet } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { codeToHtml } from 'shiki';
import { DeleteSnippetButton } from './delete-snippet-button';
import { SnippetCodeBlock } from './snippet-code-block';

type Props = {
    snippet: CodeSnippet;
};

async function highlightBlock(code: string, language: string): Promise<string> {
    try {
        return await codeToHtml(code, {
            lang: language,
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
        });
    } catch {
        // Fallback: render as plain text if language is not supported
        return `<pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    }
}

export async function SnippetDetail({ snippet }: Props) {
    const highlightedBlocks = await Promise.all(snippet.code_blocks.map((block) => highlightBlock(block.code, block.language)));

    const languages = [...new Set(snippet.code_blocks.map((b) => b.language))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight break-words">{snippet.title}</h1>
                    <div className="flex flex-wrap gap-1">
                        {snippet.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline">
                                {tag.title}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex shrink-0 gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/protected/snippets/${snippet.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <DeleteSnippetButton snippetId={snippet.id} snippetTitle={snippet.title} />
                </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>Created {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}</span>
                <span>
                    {snippet.code_blocks.length} {snippet.code_blocks.length === 1 ? 'block' : 'blocks'}
                </span>
                <div className="flex flex-wrap gap-1">
                    {languages.map((lang) => (
                        <Badge key={lang} className="text-xs">
                            {lang}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Code blocks */}
            <div className="space-y-8">
                {snippet.code_blocks.map((block, index) => (
                    <SnippetCodeBlock key={block.id} block={block} highlightedHtml={highlightedBlocks[index]} />
                ))}
            </div>
        </div>
    );
}
