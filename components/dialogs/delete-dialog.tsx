"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";

export type DeleteDialogProps = {
  title?: string;
  description?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onDeleteStart?: () => void;
};

export function DeleteDialog({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  open,
  onOpenChange,
  onDelete = () => {},
  onDeleteStart,
}: DeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    onDeleteStart?.();
    startTransition(async () => {
      onDelete();
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={isPending ? undefined : onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader className="sm:!place-items-center sm:!text-center">
          <AlertDialogMedia className="mx-auto my-0 py-0 size-10 rounded-full bg-destructive/10 text-destructive">
            <Trash2 />
          </AlertDialogMedia>

          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
