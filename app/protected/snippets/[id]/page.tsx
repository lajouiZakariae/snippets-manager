import { SnippetDetail } from '@/components/snippets/snippet-detail';
import { Button } from '@/components/ui/button';
import { SnippetsService } from '@/lib/services/snippets.service';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
            <Button asChild variant="ghost" size="sm" className="-ml-2">
                <Link href="/protected/snippets">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    All Snippets
                </Link>
            </Button>
            <SnippetDetail snippet={snippet} />
        </div>
    );
}
