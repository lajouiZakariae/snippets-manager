'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DeleteSnippetDialog } from './delete-snippet-dialog';
import type { CodeSnippetSummary } from '@/lib/types';
import { useState } from 'react';

type Props = {
    snippet: CodeSnippetSummary;
    onDeleteStart?: () => void;
};

export function SnippetCardMenu({ snippet, onDeleteStart }: Props) {
    const router = useRouter();
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        aria-label="Snippet options"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => router.push(`/protected/snippets/${snippet.id}`)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`/protected/snippets/${snippet.id}/edit`)}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteSnippetDialog
                snippetId={snippet.id}
                snippetTitle={snippet.title}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onDeleteStart={onDeleteStart}
            />
        </>
    );
}
