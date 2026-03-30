"use client";

import { setSnippetVisibility } from "@/actions/set-snippet-visibility";
import { Button } from "@/components/ui/button";
import { SnippetVisibility } from "@/lib/enums";
import { buildShareUrl, copyToClipboard } from "@/lib/utils";
import { Check, Copy, Globe, Lock } from "lucide-react";
import { useState, useTransition } from "react";

type Props = {
  snippetId: string;
  visibility: "private" | SnippetVisibility.PUBLIC;
  shareToken: string;
};

export function SnippetShareButton({
  snippetId,
  visibility,
  shareToken,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const isPublic = visibility === SnippetVisibility.PUBLIC;
  const shareUrl = buildShareUrl(shareToken);

  function toggleVisibility() {
    startTransition(async () => {
      await setSnippetVisibility(snippetId, isPublic ? SnippetVisibility.PRIVATE : SnippetVisibility.PUBLIC);
    });
  }

  function copyLink() {
    copyToClipboard(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleVisibility}
        disabled={isPending}
        aria-label={isPublic ? "Make snippet private" : "Make snippet public"}
      >
        {isPublic ? (
          <>
            <Globe className="h-4 w-4 text-green-500" />
            Public
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Private
          </>
        )}
      </Button>

      {isPublic && (
        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          aria-label="Copy share link"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy link
            </>
          )}
        </Button>
      )}
    </div>
  );
}
