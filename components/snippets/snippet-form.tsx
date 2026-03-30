"use client";

import { createSnippet } from "@/actions/create-snippet";
import { updateSnippet } from "@/actions/update-snippet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CodeSnippet, Tag } from "@/lib/types";
import type { BlockInput } from "@/lib/validations/snippet.schema";
import { Globe, Loader2, Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { SnippetBlockFields } from "./snippet-block-fields";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  snippet?: CodeSnippet;
  allTags: Tag[];
};

const EMPTY_BLOCK: BlockInput = {
  title: "",
  description: "",
  language: "typescript",
  code: "",
  position: 0,
};

export function SnippetForm({ mode, snippet, allTags }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(snippet?.title ?? "");
  const [visibility, setVisibility] = useState<"private" | "public">(
    snippet?.visibility ?? "private",
  );

  const [selectedTags, setSelectedTags] = useState<string[]>(
    snippet?.tags.map((t) => t.title) ?? [],
  );

  const [blocks, setBlocks] = useState<BlockInput[]>(
    snippet?.code_blocks.map((b) => ({
      title: b.title,
      description: b.description ?? "",
      language: b.language,
      code: b.code,
      position: b.position,
    })) ?? [{ ...EMPTY_BLOCK }],
  );
  const [newTagInput, setNewTagInput] = useState("");

  const action =
    mode === "create" ? createSnippet : updateSnippet.bind(null, snippet!.id);

  const [state, formAction, isPending] = useActionState(action, null);

  const errors = state && !state.success ? (state as any).errors : {};

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
    setNewTagInput("");
  }

  function removeTag(tag: string) {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(newTagInput);
    }
  }

  function handleSubmit(formData: FormData) {
    const payload = {
      title,
      visibility,
      tags: selectedTags,
      blocks,
    };

    formData.set("__json", JSON.stringify(payload));

    formAction(formData);
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Snippet title */}
      <div className="space-y-1.5">
        <Label htmlFor="snippet-title">Title *</Label>
        <Input
          id="snippet-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. React custom hook for debounced value"
          required
        />
        {errors?.title?.map((e: string) => (
          <p key={e} className="text-sm text-destructive">
            {e}
          </p>
        ))}
      </div>

      {/* Visibility */}
      <div className="space-y-1.5">
        <Label>Visibility</Label>
        <Select
          value={visibility}
          onValueChange={(v) => setVisibility(v as "private" | "public")}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">
              <span className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Private
              </span>
            </SelectItem>
            <SelectItem value="public">
              <span className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                Public
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex min-h-[36px] flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="New tag (press Enter)"
            className="flex-1"
            aria-label="Create new tag"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addTag(newTagInput)}
            disabled={!newTagInput.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Code blocks */}
      <SnippetBlockFields
        blocks={blocks}
        errors={errors}
        onChange={setBlocks}
      />

      {/* Form-level error */}
      {errors?._form?.map((e: string) => (
        <p key={e} className="text-sm text-destructive">
          {e}
        </p>
      ))}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : mode === "create" ? (
            "Create Snippet"
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
