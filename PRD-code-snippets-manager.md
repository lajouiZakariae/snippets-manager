# Project Requirements Document

## Code Snippets Manager — Next.js Application

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Database Design](#4-database-design)
5. [Pages & Features](#5-pages--features)
6. [Component Architecture](#6-component-architecture)
7. [Server Actions](#7-server-actions)
8. [Service Layer](#8-service-layer)
9. [Validation (Zod Schemas)](#9-validation-zod-schemas)
10. [Styling Guidelines](#10-styling-guidelines)
11. [Error Handling & UX](#11-error-handling--ux)

---

## 1. Project Overview

A full-stack **Code Snippets Manager** that allows users to organize, browse, create, edit, and delete code snippets. Each snippet can contain multiple code blocks (each with their own language, title, and description), can be tagged for easy filtering, and can be searched by title.

### Core Capabilities

- List, search, and filter code snippets by title, programming language, and tags.
- Create new snippets with one or more code blocks.
- View the full detail of a snippet and its blocks.
- Edit any existing snippet and its blocks.
- Delete snippets with a confirmation modal.

---

## 2. Tech Stack

| Layer              | Technology                                                            |
| ------------------ | --------------------------------------------------------------------- |
| Framework          | Next.js 15+ (App Router) with React 19                                |
| Language           | TypeScript 5                                                          |
| Database / Backend | Supabase — `@supabase/supabase-js` + `@supabase/ssr`                  |
| Auth               | Supabase Auth (email/password) — already scaffolded under `app/auth/` |
| Styling            | Tailwind CSS v3 with CSS variables (class-based dark mode)            |
| UI Components      | shadcn/ui (`new-york` style, `neutral` base color)                    |
| Icons              | Lucide React                                                          |
| Font               | Geist (`next/font/google`)                                            |
| Theme              | `next-themes` (system default, supports dark/light)                   |
| Validation         | Zod (add to `dependencies`)                                           |
| Code Highlighting  | `shiki` (add to `dependencies`)                                       |
| Date formatting    | `date-fns` (add to `dependencies`)                                    |
| State (client)     | React `useState` / `useTransition`                                    |
| Forms              | React uncontrolled inputs + Server Actions                            |

---

## 3. Project Structure

```
/
├── proxy.ts                              # Next.js proxy (session refresh) — replaces middleware.ts
├── app/
│   ├── layout.tsx                        # Root layout (Geist font, ThemeProvider)
│   ├── page.tsx                          # Redirects to /protected/snippets
│   ├── auth/                             # Auth pages — already scaffolded
│   │   ├── confirm/route.ts
│   │   ├── error/page.tsx
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── sign-up-success/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── update-password/page.tsx
│   └── protected/
│       ├── layout.tsx                    # Protected layout (nav, auth guard)
│       ├── page.tsx                      # Redirects to /protected/snippets
│       └── snippets/
│           ├── page.tsx                  # List & filter page (Server Component)
│           ├── new/
│           │   └── page.tsx              # Create snippet page
│           └── [id]/
│               ├── page.tsx              # Snippet detail page
│               └── edit/
│                   └── page.tsx          # Edit snippet page
├── components/
│   ├── snippets/
│   │   ├── snippets-page.tsx             # Data-fetching server component for list
│   │   ├── snippets-listing.tsx          # Pure presentational grid
│   │   ├── snippet-card.tsx              # Single card component
│   │   ├── snippet-card-menu.tsx         # Dropdown menu (Edit/Details/Delete)
│   │   ├── delete-snippet-dialog.tsx     # Confirmation modal
│   │   ├── snippets-filters.tsx          # Search + language + tag filters (client)
│   │   ├── snippet-detail.tsx            # Detail page layout
│   │   ├── snippet-code-block.tsx        # Single code block with syntax highlight
│   │   ├── snippet-form.tsx              # Shared create/edit form (client)
│   │   └── snippet-block-fields.tsx      # Dynamic block fields within the form
│   └── ui/                               # shadcn/ui generated components
├── lib/
│   ├── utils.ts                          # cn(), hasEnvVars
│   ├── types.ts                          # Shared TypeScript types
│   ├── supabase/
│   │   ├── client.ts                     # Browser client (createBrowserClient)
│   │   ├── server.ts                     # Server client (createServerClient + cookies)
│   │   └── proxy.ts                      # Session refresh logic for proxy.ts
│   ├── services/
│   │   ├── snippets.service.ts           # All snippet DB logic
│   │   ├── tags.service.ts               # All tag DB logic
│   │   └── blocks.service.ts             # All code block DB logic
│   └── validations/
│       └── snippet.schema.ts             # Zod schemas
├── actions/
│   ├── create-snippet.ts                 # Server Action: create
│   ├── update-snippet.ts                 # Server Action: update
│   └── delete-snippet.ts                 # Server Action: delete
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql        # Initial DB migration
```

---

## 4. Database Design

### 4.1 Tables

#### `tags`

```sql
create table tags (
  id        uuid primary key default gen_random_uuid(),
  title     text not null unique,
  created_at timestamptz not null default now()
);
```

#### `code_snippets`

```sql
create table code_snippets (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  created_at timestamptz not null default now()
);
```

#### `code_snippet_tags` _(pivot table)_

```sql
create table code_snippet_tags (
  snippet_id uuid not null references code_snippets(id) on delete cascade,
  tag_id     uuid not null references tags(id) on delete cascade,
  primary key (snippet_id, tag_id)
);
```

#### `code_blocks`

```sql
create table code_blocks (
  id          uuid primary key default gen_random_uuid(),
  snippet_id  uuid not null references code_snippets(id) on delete cascade,
  title       text not null,
  description text,
  code        text not null,
  language    text not null,
  position    integer not null default 0,  -- for ordering blocks within a snippet
  created_at  timestamptz not null default now()
);
```

### 4.2 Indexes

```sql
create index on code_blocks (snippet_id);
create index on code_snippet_tags (snippet_id);
create index on code_snippet_tags (tag_id);
```

### 4.3 Entity Relationships

```
code_snippets ──< code_blocks         (1-to-many, cascade delete)
code_snippets >──< tags               (many-to-many via code_snippet_tags)
```

### 4.4 TypeScript Types

```ts
// lib/types.ts

export type Tag = {
    id: string;
    title: string;
    created_at: string;
};

export type CodeBlock = {
    id: string;
    snippet_id: string;
    title: string;
    description: string | null;
    code: string;
    language: string;
    position: number;
    created_at: string;
};

export type CodeSnippet = {
    id: string;
    title: string;
    created_at: string;
    tags: Tag[];
    code_blocks: CodeBlock[];
};

// Lightweight version used in the listing grid (no full block code)
export type CodeSnippetSummary = {
    id: string;
    title: string;
    created_at: string;
    tags: Tag[];
    block_count: number;
    languages: string[]; // distinct languages across all blocks
};
```

---

## 5. Pages & Features

### 5.1 Snippets List Page — `/protected/snippets`

**Purpose:** Browse, search, and filter all code snippets.

**Route file:** `app/protected/snippets/page.tsx`

**Data Flow:**

- `page.tsx` reads `searchParams` (title, language, tags) and passes them to `<SnippetsPage />`.
- `<SnippetsPage />` is a server component that calls `SnippetsService.getAll(filters)` and renders `<SnippetsFilters />` + `<SnippetsListing />`.

**Filter Controls** (`snippets-filters.tsx` — Client Component):

- A text `Input` for searching by title (debounced, updates URL query param).
- A `Select` dropdown for filtering by programming language (populated from distinct languages in DB).
- A multi-select or tag pills component for filtering by tags (populated from `tags` table).
- Filters update the URL using `useRouter` + `useSearchParams`, allowing server-side filtering via `searchParams`.

**Grid Layout** (`snippets-listing.tsx`):

- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` using Tailwind.
- Renders a `<SnippetCard />` for each snippet.
- Shows an empty state (`<EmptyState />`) when no snippets match.

**Snippet Card** (`snippet-card.tsx`):
Each card displays:

- **Title** — prominent, links to detail page.
- **Language badges** — `<Badge>` pill for each distinct language across blocks.
- **Tag badges** — `<Badge variant="outline">` for each tag.
- **Created At** — formatted relative time (e.g., "3 days ago") using `date-fns`.
- **Block count** — small muted text, e.g., "4 blocks".
- **Dropdown menu** (`snippet-card-menu.tsx`) — `<DropdownMenu>` with three items:
    - `Eye` icon → "View Details" → navigates to `/protected/snippets/[id]`
    - `Pencil` icon → "Edit" → navigates to `/protected/snippets/[id]/edit`
    - `Trash2` icon → "Delete" → opens `<DeleteSnippetDialog />` (red destructive color)

**Delete Confirmation Modal** (`delete-snippet-dialog.tsx`):

- `<AlertDialog>` from shadcn.
- Displays: _"Are you sure you want to delete '[title]'? This action cannot be undone."_
- Confirm button uses `variant="destructive"` (red).
- On confirm, calls the `deleteSnippet` server action, then redirects back to `/protected/snippets`.

---

### 5.2 Create Snippet Page — `/protected/snippets/new`

**Route file:** `app/protected/snippets/new/page.tsx`

Renders the `<SnippetForm />` in "create" mode (no initial data).

---

### 5.3 Snippet Detail Page — `/protected/snippets/[id]`

**Route file:** `app/protected/snippets/[id]/page.tsx`

**Data Flow:**

- `page.tsx` calls `SnippetsService.getById(id)` and passes full `CodeSnippet` to `<SnippetDetail />`.

**Layout** (`snippet-detail.tsx`):

- Page header with the snippet `title` and its tag badges.
- A row of metadata: created date, block count, all distinct language badges.
- Action buttons in the top-right: `Edit` button (→ `/protected/snippets/[id]/edit`) and `Delete` button (opens modal).
- A vertical list of `<SnippetCodeBlock />` components, one per code block, ordered by `position`.

**Code Block** (`snippet-code-block.tsx`):

- **Block title** — heading (`h3`).
- **Description** — small muted paragraph (`text-muted-foreground text-sm`), only shown if present.
- **Code** — rendered inside a syntax-highlighted code block using `shiki` inside a `<Card>` with a header showing the language badge and a "Copy" button (Lucide `Copy` icon).

---

### 5.4 Edit Snippet Page — `/protected/snippets/[id]/edit`

**Route file:** `app/protected/snippets/[id]/edit/page.tsx`

**Data Flow:**

- `page.tsx` calls `SnippetsService.getById(id)` and passes the existing data to `<SnippetForm />` in "edit" mode.

---

### 5.5 Shared Snippet Form — `snippet-form.tsx` (Client Component)

Used by both the Create and Edit pages.

**Form Fields:**

- **Title** — `<Input>` (required).
- **Tags** — a multi-select combo-box (from existing tags) + ability to create new tags inline.
- **Code Blocks** section — dynamic list rendered by `<SnippetBlockFields />`:
    - Each block has: `title` (Input), `description` (Textarea, optional), `language` (Select), `code` (Textarea with monospace font).
    - **"Add Block"** button (Lucide `Plus` icon) appends a new empty block.
    - Each block has a **"Remove"** button (Lucide `Trash2`, destructive color) to remove it (minimum 1 block required).
    - Blocks can be reordered (drag-and-drop optional — out of scope for v1, can use up/down arrows instead).

**Form submission:**

- Calls `createSnippet` or `updateSnippet` server action using `useTransition` for pending state.
- Shows a `<Loader2 className="animate-spin" />` on the submit button while pending.
- On success, redirects to the snippet detail page.
- On validation error, displays inline field errors from Zod.

---

## 6. Component Architecture

### Component Responsibility Principle

> Each "page-level" server component fetches data. It delegates rendering to a pure presentational child that accepts props only.

```
app/protected/snippets/page.tsx
  └── components/snippets/snippets-page.tsx   ← server: fetches data
        ├── snippets-filters.tsx               ← client: search/filter UI
        └── snippets-listing.tsx               ← presentational: renders grid
              └── snippet-card.tsx             ← presentational: single card
                    └── snippet-card-menu.tsx  ← client: dropdown with actions
                          └── delete-snippet-dialog.tsx ← client: alert dialog
```

```
app/protected/snippets/[id]/page.tsx
  └── components/snippets/snippet-detail.tsx  ← server: receives full snippet
        └── snippet-code-block.tsx            ← presentational: single block
```

```
app/protected/snippets/new/page.tsx
app/protected/snippets/[id]/edit/page.tsx
  └── components/snippets/snippet-form.tsx    ← client: full form with state
        └── snippet-block-fields.tsx          ← client: dynamic block rows
```

---

## 7. Server Actions

All mutations go through server actions in `/actions/`. Each action:

1. Parses and validates the `FormData` with Zod.
2. Returns structured errors on failure (compatible with `useFormState`).
3. Calls the appropriate service method on success.
4. Calls `revalidatePath` and then `redirect`.

### `actions/create-snippet.ts`

```ts
'use server';

export async function createSnippet(prevState: unknown, formData: FormData) {
    // 1. Parse & validate with Zod CreateSnippetSchema
    // 2. Call SnippetsService.create(data)
    // 3. revalidatePath('/protected/snippets')
    // 4. redirect(`/protected/snippets/${newSnippet.id}`)
}
```

### `actions/update-snippet.ts`

```ts
'use server';

export async function updateSnippet(id: string, prevState: unknown, formData: FormData) {
    // 1. Parse & validate with Zod UpdateSnippetSchema
    // 2. Call SnippetsService.update(id, data)
    // 3. revalidatePath('/protected/snippets')
    // 4. revalidatePath(`/protected/snippets/${id}`)
    // 5. redirect(`/protected/snippets/${id}`)
}
```

### `actions/delete-snippet.ts`

```ts
'use server';

export async function deleteSnippet(id: string) {
    // 1. Call SnippetsService.delete(id)
    // 2. revalidatePath('/protected/snippets')
    // 3. redirect('/protected/snippets')
}
```

---

## 8. Service Layer

All Supabase queries are encapsulated in service classes under `lib/services/`. Components and server actions never import the Supabase client directly — they always go through a service.

**Supabase client import pattern** (always `await createClient()` — never store in a module-level variable, required with Fluid compute):

```ts
import { createClient } from '@/lib/supabase/server';
// inside the method:
const supabase = await createClient();
```

Env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

### `lib/services/snippets.service.ts`

```ts
export class SnippetsService {
    // Returns paginated/filtered snippet summaries for the listing page
    static async getAll(filters: SnippetFilters): Promise<CodeSnippetSummary[]>;

    // Returns a full snippet with all blocks and tags
    static async getById(id: string): Promise<CodeSnippet>;

    // Creates snippet, blocks, and tag associations in a transaction
    static async create(data: CreateSnippetInput): Promise<CodeSnippet>;

    // Updates snippet title, replaces blocks, syncs tags
    static async update(id: string, data: UpdateSnippetInput): Promise<CodeSnippet>;

    // Deletes snippet (cascade handles blocks + pivot rows)
    static async delete(id: string): Promise<void>;

    // Returns distinct languages across all blocks (for filter dropdown)
    static async getDistinctLanguages(): Promise<string[]>;
}
```

### `lib/services/tags.service.ts`

```ts
export class TagsService {
    // Returns all tags (for filter and form multi-select)
    static async getAll(): Promise<Tag[]>;

    // Creates a tag if it doesn't already exist, returns it
    static async upsert(title: string): Promise<Tag>;
}
```

### `lib/services/blocks.service.ts`

```ts
export class BlocksService {
    // Replaces all blocks for a snippet (delete old, insert new)
    static async replaceForSnippet(snippetId: string, blocks: BlockInput[]): Promise<CodeBlock[]>;
}
```

---

## 9. Validation (Zod Schemas)

**`lib/validations/snippet.schema.ts`**

```ts
import { z } from 'zod';

export const CodeBlockSchema = z.object({
    title: z.string().min(1, 'Block title is required').max(150),
    description: z.string().max(500).optional(),
    language: z.string().min(1, 'Language is required'),
    code: z.string().min(1, 'Code is required'),
    position: z.number().int().nonnegative(),
});

export const CreateSnippetSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    tags: z.array(z.string()).optional().default([]),
    blocks: z.array(CodeBlockSchema).min(1, 'At least one code block is required'),
});

export const UpdateSnippetSchema = CreateSnippetSchema;

export type CreateSnippetInput = z.infer<typeof CreateSnippetSchema>;
export type UpdateSnippetInput = z.infer<typeof UpdateSnippetSchema>;
```

---

## 10. Styling Guidelines

### General Principles

- Use **Tailwind CSS** utility classes exclusively; no custom CSS files unless unavoidable. Colors are CSS variables defined in `globals.css` and resolved via `tailwind.config.ts`.
- Stick to **shadcn/ui** (`new-york` style, `neutral` base color) primitives: `Card`, `Badge`, `Button`, `Input`, `Textarea`, `Select`, `DropdownMenu`, `AlertDialog`, `Dialog`, `Skeleton`.
- Use **Lucide React** for all icons. Never use emoji as icons.
- Use the `cn()` helper from `@/lib/utils` for conditional class merging.
- The app uses **Geist** font (`next/font/google`) — do not override the root font family.
- Dark/light mode is handled by **`next-themes`** (`attribute="class"`, `defaultTheme="system"`). Use semantic Tailwind tokens (`bg-background`, `text-foreground`, etc.) rather than hardcoded colours.
- Keep the UI clean and minimal; avoid decorative elements that don't carry meaning.

### Color Semantics

| Intent                        | Tailwind / shadcn class                               |
| ----------------------------- | ----------------------------------------------------- |
| Primary action (Save, Create) | `Button` default variant                              |
| Secondary / neutral action    | `Button variant="outline"`                            |
| Navigation link               | `Button variant="ghost"`                              |
| Destructive (Delete)          | `Button variant="destructive"` — red                  |
| Language badge                | `Badge` (filled, colored by language family optional) |
| Tag badge                     | `Badge variant="outline"`                             |
| Muted metadata text           | `text-muted-foreground text-sm`                       |

### Responsive Grid

```
grid grid-cols-1 gap-4
sm:grid-cols-2
lg:grid-cols-3
```

### Code Block Display

- Background: `bg-muted` / `bg-zinc-900` (dark) inside a `<Card>`.
- Font: `font-mono text-sm`.
- Copy button: absolute-positioned top-right inside the card header.
- Language indicator: small `<Badge>` in the card header.

---

## 11. Error Handling & UX

### Loading States

- Use `<Skeleton />` components in the listing grid while data loads (via Suspense boundaries).
- Show `<Loader2 className="animate-spin" />` on submit buttons during form submission.

### Empty States

- When no snippets exist or no results match filters, show a centered empty state with a Lucide icon (e.g., `Code2`), a short message, and a "Create your first snippet" button.

### Error States

- Wrap server data-fetching in `try/catch`; render an `<ErrorState />` component with a retry option on failure.
- Form validation errors render inline below each field using `<p className="text-destructive text-sm">`.

### Toast Notifications

- Use shadcn's `useToast` to confirm successful create/update/delete actions.
- Error toasts for unexpected server errors.

### Accessibility

- All interactive elements must have accessible labels (`aria-label` or visible text).
- Focus management: after a modal closes, focus returns to the triggering element.
- Code blocks have a `<pre role="region" aria-label="Code block: {title}">` wrapper.

---

_Document version 1.0 — generated for initial development sprint._
