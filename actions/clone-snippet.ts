"use server";

import { SnippetVisibility } from "@/lib/enums";
import { AuthUserService } from "@/lib/services/auth-user-service";
import { SnippetsService } from "@/lib/services/snippets.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function cloneSnippet(shareToken: string) {
  await AuthUserService.getAuthUserOrRedirect();

  const snippet = await SnippetsService.getByShareToken(shareToken);

  const cloned = await SnippetsService.create({
    title: snippet.title,
    visibility: SnippetVisibility.PRIVATE,
    tags: snippet.tags.map((t) => t.title),
    blocks: snippet.code_blocks.map((b) => ({
      title: b.title,
      description: b.description ?? undefined,
      language: b.language,
      code: b.code,
      position: b.position,
    })),
  });

  revalidatePath("/protected/snippets");
  redirect(`/protected/snippets/${cloned.id}`);
}
