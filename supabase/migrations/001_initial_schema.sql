-- Tags
create table tags (
  id         uuid primary key default gen_random_uuid(),
  title      text not null unique,
  created_at timestamptz not null default now()
);

-- Code snippets
create table code_snippets (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  created_at timestamptz not null default now()
);

-- Pivot table: snippets ↔ tags (many-to-many)
create table code_snippet_tags (
  snippet_id uuid not null references code_snippets(id) on delete cascade,
  tag_id     uuid not null references tags(id) on delete cascade,
  primary key (snippet_id, tag_id)
);

-- Code blocks (belong to a snippet)
create table code_blocks (
  id          uuid primary key default gen_random_uuid(),
  snippet_id  uuid not null references code_snippets(id) on delete cascade,
  title       text not null,
  description text,
  code        text not null,
  language    text not null,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Indexes
create index on code_blocks (snippet_id);
create index on code_snippet_tags (snippet_id);
create index on code_snippet_tags (tag_id);
