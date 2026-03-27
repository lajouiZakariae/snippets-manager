'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteSnippetDialog } from './delete-snippet-dialog';

type Props = {
    snippetId: string;
    snippetTitle: string;
};

export function DeleteSnippetButton({ snippetId, snippetTitle }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </Button>
            <DeleteSnippetDialog snippetId={snippetId} snippetTitle={snippetTitle} open={open} onOpenChange={setOpen} />
        </>
    );
}
