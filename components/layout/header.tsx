import { LogoutButton } from '@/components/logout-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Code2 } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <Link href="/protected/snippets" className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80">
                    <Code2 className="h-5 w-5" />
                    Snippets Manager
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
}
