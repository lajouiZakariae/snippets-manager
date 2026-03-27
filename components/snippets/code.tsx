'use client';

import type { CodeBlock } from '@/lib/types';
import { cn } from '@/lib/utils';
import { use } from 'react';

type CodeProps = Pick<CodeBlock, 'title'> & { highlightedHtmlPromise: Promise<string> };

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
