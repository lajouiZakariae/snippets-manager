'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CodeBlock } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type Props = {
    block: CodeBlock;
    highlightedHtml: string;
};

export function SnippetCodeBlock({ block, highlightedHtml }: Props) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(block.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="space-y-2">
            <h3 className="text-base font-medium">{block.title}</h3>
            {block.description && <p className="text-sm text-muted-foreground">{block.description}</p>}
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/50 px-4 py-2">
                    <Badge variant="outline" className="font-mono text-xs">
                        {block.language}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy} aria-label="Copy code">
                        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <pre
                        role="region"
                        aria-label={`Code block: ${block.title}`}
                        className={cn('overflow-x-auto p-4 font-mono text-sm leading-relaxed', '[&>pre]:!bg-transparent [&>pre]:!p-0')}
                        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
