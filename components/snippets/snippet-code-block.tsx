'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CodeBlock } from '@/lib/types';
import { copyToClipboard, highlightBlock } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { Suspense, useState } from 'react';
import { Code } from './code';

type Props = CodeBlock;

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
