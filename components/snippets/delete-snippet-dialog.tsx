'use client';

import { deleteSnippet } from '@/actions/delete-snippet';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';

type Props = {
    snippetId: string;
    snippetTitle: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleteStart?: () => void;
};

export function DeleteSnippetDialog({ snippetId, snippetTitle, open, onOpenChange, onDeleteStart }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleConfirm() {
        onDeleteStart?.();
        startTransition(async () => {
            await deleteSnippet(snippetId);
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete snippet?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete &quot;{snippetTitle}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
