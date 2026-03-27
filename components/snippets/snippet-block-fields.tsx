'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { BlockInput } from '@/lib/validations/snippet.schema';
import { Plus, Trash2 } from 'lucide-react';

const LANGUAGES = [
    'bash',
    'c',
    'cpp',
    'css',
    'go',
    'html',
    'java',
    'javascript',
    'jsx',
    'json',
    'kotlin',
    'markdown',
    'php',
    'python',
    'ruby',
    'rust',
    'scala',
    'shell',
    'sql',
    'swift',
    'toml',
    'typescript',
    'tsx',
    'yaml',
];

type Props = {
    blocks: BlockInput[];
    errors?: Record<string, string[] | undefined>;
    onChange: (blocks: BlockInput[]) => void;
};

export function SnippetBlockFields({ blocks, errors, onChange }: Props) {
    function updateBlock(index: number, updates: Partial<BlockInput>) {
        const next = blocks.map((b, i) => (i === index ? { ...b, ...updates } : b));
        onChange(next);
    }

    function addBlock() {
        onChange([...blocks, { title: '', description: '', language: 'typescript', code: '', position: blocks.length }]);
    }

    function removeBlock(index: number) {
        if (blocks.length <= 1) return;
        onChange(blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, position: i })));
    }

    function moveBlock(index: number, direction: 'up' | 'down') {
        const next = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= next.length) return;
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        onChange(next.map((b, i) => ({ ...b, position: i })));
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Code Blocks</Label>
                <Button type="button" variant="outline" size="sm" onClick={addBlock}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Block
                </Button>
            </div>

            {blocks.map((block, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 px-4 py-3">
                        <span className="text-sm font-medium text-muted-foreground">Block {index + 1}</span>
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={index === 0}
                                onClick={() => moveBlock(index, 'up')}
                                aria-label="Move block up"
                            >
                                ↑
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={index === blocks.length - 1}
                                onClick={() => moveBlock(index, 'down')}
                                aria-label="Move block down"
                            >
                                ↓
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                disabled={blocks.length <= 1}
                                onClick={() => removeBlock(index)}
                                aria-label="Remove block"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor={`block-title-${index}`}>Title *</Label>
                                <Input
                                    id={`block-title-${index}`}
                                    value={block.title}
                                    onChange={(e) => updateBlock(index, { title: e.target.value })}
                                    placeholder="e.g. Install dependencies"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`block-language-${index}`}>Language *</Label>
                                <Select value={block.language} onValueChange={(val) => updateBlock(index, { language: val })}>
                                    <SelectTrigger id={`block-language-${index}`}>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LANGUAGES.map((lang) => (
                                            <SelectItem key={lang} value={lang}>
                                                {lang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor={`block-description-${index}`}>
                                Description <span className="text-xs text-muted-foreground">(optional)</span>
                            </Label>
                            <Textarea
                                id={`block-description-${index}`}
                                value={block.description ?? ''}
                                onChange={(e) => updateBlock(index, { description: e.target.value })}
                                placeholder="Briefly describe what this code block does…"
                                rows={2}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor={`block-code-${index}`}>Code *</Label>
                            <Textarea
                                id={`block-code-${index}`}
                                value={block.code}
                                onChange={(e) => updateBlock(index, { code: e.target.value })}
                                placeholder="Paste your code here…"
                                rows={8}
                                className="font-mono text-sm"
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
