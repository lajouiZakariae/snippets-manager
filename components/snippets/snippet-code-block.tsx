'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CodeBlock } from '@/lib/types';
import { cn, copyToClipboard } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { Suspense, use, useState } from 'react';
import { codeToHtml } from 'shiki';

type Props = CodeBlock;

async function highlightBlock(code: string, language: string): Promise<string> {
    try {
        return await codeToHtml(code, {
            lang: language,
            themes: { light: 'github-light', dark: 'github-dark' },
        });
    } catch {
        // Fallback: render as plain text if language is not supported
        return `<pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    }
}

type CodeProps = Pick<Props, 'title'> & { highlightedHtmlPromise: Promise<string> };

export function Code({ title, highlightedHtmlPromise }: CodeProps) {
    const highlightedHtml = use(highlightedHtmlPromise);

    return (
        <pre
            role="region"
            aria-label={`Code block: ${title}`}
            className={cn('overflow-x-auto p-4 font-mono text-sm leading-relaxed', '[&>pre]:!bg-transparent [&>pre]:!p-0')}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
    );
}

export function SnippetCodeBlock({ title, code, language, description }: Props) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await copyToClipboard(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="space-y-2">
            <h3 className="text-base font-medium">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/50 px-4 py-2">
                    <Badge variant="outline" className="font-mono text-xs">
                        {language}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy} aria-label="Copy code">
                        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Suspense fallback={<pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">Loading...</pre>}>
                        <Code title={title} highlightedHtmlPromise={highlightBlock(code, language)} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
