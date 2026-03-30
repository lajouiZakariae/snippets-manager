import { clsx, type ClassValue } from "clsx";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(content: string) {
  await navigator.clipboard.writeText(content);
}

export function buildShareUrl(shareToken: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/shared/${shareToken}`;
}

export async function highlightBlock(
  code: string,
  language: string,
): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang: language,
      themes: { light: "github-light", dark: "github-dark" },
    });
  } catch {
    // Fallback: render as plain text if language is not supported
    return `<pre>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
  }
}
