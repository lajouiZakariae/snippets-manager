'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Tag } from '@/lib/types';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
    languages: string[];
    tags: Tag[];
};

const ALL_VALUE = '__all__';

export function SnippetsFilters({ languages, tags }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [title, setTitle] = useState(searchParams.get('title') ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const buildUrl = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(updates)) {
                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            }
            return `${pathname}?${params.toString()}`;
        },
        [pathname, searchParams],
    );

    // Debounce title filter
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.push(buildUrl({ title: title || null }));
        }, 350);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [title, buildUrl, router]);

    const currentLanguage = searchParams.get('language') ?? ALL_VALUE;
    const currentTagId = searchParams.get('tagId') ?? ALL_VALUE;

    const hasFilters = !!searchParams.get('title') || !!searchParams.get('language') || !!searchParams.get('tagId');

    function clearFilters() {
        setTitle('');
        router.push(pathname);
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[180px] flex-1">
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search snippets…"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="pl-8"
                    aria-label="Search snippets by title"
                />
            </div>

            <Select value={currentLanguage} onValueChange={(val) => router.push(buildUrl({ language: val === ALL_VALUE ? null : val }))}>
                <SelectTrigger className="w-[160px]" aria-label="Filter by language">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_VALUE}>All languages</SelectItem>
                    {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                            {lang}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={currentTagId} onValueChange={(val) => router.push(buildUrl({ tagId: val === ALL_VALUE ? null : val }))}>
                <SelectTrigger className="w-[150px]" aria-label="Filter by tag">
                    <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_VALUE}>All tags</SelectItem>
                    {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                            {tag.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} aria-label="Clear filters">
                    <X className="mr-1 h-4 w-4" />
                    Clear
                </Button>
            )}
        </div>
    );
}
