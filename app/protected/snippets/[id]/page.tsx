import { BackButton } from "@/components/back-button";
import { SnippetDetail } from "@/components/snippets/snippet-detail";
import { SnippetsService } from "@/lib/services/snippets.service";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SnippetDetailPage({ params }: Props) {
  const { id } = await params;

  let snippet;
  try {
    snippet = await SnippetsService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <BackButton
        url="/protected/snippets"
        className="-ml-2"
        text="All Snippets"
      />

      <SnippetDetail snippet={snippet} />
    </div>
  );
}
