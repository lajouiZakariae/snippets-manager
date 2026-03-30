"use client";

import { deleteSnippet } from "@/actions/delete-snippet";
import { DeleteDialog } from "../dialogs/delete-dialog";

type Props = {
  snippetId: string;
  snippetTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteStart?: () => void;
};

export function DeleteSnippetDialog({
  snippetId,
  snippetTitle,
  open,
  onOpenChange,
  onDeleteStart,
}: Props) {
  async function onDelete() {
    await deleteSnippet(snippetId);
  }

  return (
    <DeleteDialog
      title="Delete snippet?"
      description={
        <>
          <span className="font-medium text-foreground">
            &quot;{snippetTitle}&quot;
          </span>{" "}
          will be permanently deleted. This action cannot be undone.
        </>
      }
      open={open}
      onOpenChange={onOpenChange}
      onDelete={onDelete}
      onDeleteStart={onDeleteStart}
    />
  );
}
