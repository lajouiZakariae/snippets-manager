import { CloneSnippetButton } from "@/components/snippets/clone-snippet-button";
import { SnippetCodeBlock } from "@/components/snippets/snippet-code-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthUserService } from "@/lib/services/auth-user-service";
import { SnippetsService } from "@/lib/services/snippets.service";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function SharedSnippetPage({ params }: Props) {
  const { token } = await params;

  const user = await AuthUserService.getAuthUser();

  let snippet;
  try {
    snippet = await SnippetsService.getByShareToken(token);
  } catch {
    notFound();
  }

  const languages = [...new Set(snippet.code_blocks.map((b) => b.language))];

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="border-b bg-muted/40 px-4 py-2 text-center text-sm text-muted-foreground">
        Shared snippet via{" "}
        <span className="font-semibold text-foreground">Snippets Manager</span>
        {" — "}
        <Button asChild variant="link" size="sm" className="h-auto p-0 text-sm">
          <Link href="/protected/snippets/new">Create your own →</Link>
        </Button>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight break-words">
              {snippet.title}
            </h1>
            <div className="flex flex-wrap gap-1">
              {snippet.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.title}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <CloneSnippetButton shareToken={token} isAuthenticated={!!user} />
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>
            Created{" "}
            {formatDistanceToNow(new Date(snippet.created_at), {
              addSuffix: true,
            })}
          </span>
          <span>
            {snippet.code_blocks.length}{" "}
            {snippet.code_blocks.length === 1 ? "block" : "blocks"}
          </span>
          <div className="flex flex-wrap gap-1">
            {languages.map((lang) => (
              <Badge key={lang} className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Code blocks */}
        <div className="space-y-8">
          {snippet.code_blocks.map((block) => (
            <SnippetCodeBlock key={block.id} {...block} />
          ))}
        </div>
      </div>
    </div>
  );
}
