import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function BackButton({ url, className = '', text = 'Back' }: { url: string; text?: string; className?: string }) {
    return (
        <Button asChild variant="ghost" size="sm" className={className}>
            <Link href={url}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {text}
            </Link>
        </Button>
    );
}
