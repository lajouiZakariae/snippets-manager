"use client";

import { setSnippetVisibility } from "@/actions/set-snippet-visibility";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CodeSnippetSummary } from "@/lib/types";
import { buildShareUrl, copyToClipboard } from "@/lib/utils";
import { Eye, Link, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DeleteSnippetDialog } from "./delete-snippet-dialog";
import { SnippetVisibility } from "@/lib/enums";

type Props = {
  snippet: CodeSnippetSummary;
  onDeleteStart?: () => void;
};

export function SnippetCardMenu({ snippet, onDeleteStart }: Props) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [, startTransition] = useTransition();

  function handleShare() {
    if (snippet.visibility === SnippetVisibility.PRIVATE) {
      startTransition(async () => {
        await setSnippetVisibility(snippet.id, SnippetVisibility.PUBLIC);
        copyToClipboard(buildShareUrl(snippet.share_token));
      });
    } else {
      copyToClipboard(buildShareUrl(snippet.share_token));
    }
  }

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
            onClick={() =>
              router.push(`/protected/snippets/${snippet.id}/edit`)
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Link className="mr-2 h-4 w-4" />
            Copy link
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
