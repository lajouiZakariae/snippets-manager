"use client";

import { cloneSnippet } from "@/actions/clone-snippet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy } from "lucide-react";
import { useTransition } from "react";

type Props = {
  shareToken: string;
  isAuthenticated: boolean;
};

export function CloneSnippetButton({ shareToken, isAuthenticated }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClone() {
    startTransition(() => {
      cloneSnippet(shareToken);
    });
  }

  const isDisabled = !isAuthenticated || isPending;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* span needed so the tooltip works on a disabled button */}
        <span tabIndex={isDisabled ? 0 : undefined}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClone}
            disabled={isDisabled}
          >
            <Copy className="mr-2 size-4" />
            {isPending ? "Cloning…" : "Clone"}
          </Button>
        </span>
      </TooltipTrigger>
      {!isAuthenticated && (
        <TooltipContent>
          <p>Sign in to clone this snippet</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
