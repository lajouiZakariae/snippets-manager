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
export type BlockInput = z.infer<typeof CodeBlockSchema>;
