import { LogoutButton } from '@/components/logout-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { AuthUserService } from '@/services/auth-user-service';
import { Code2 } from 'lucide-react';
import Link from 'next/link';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    await AuthUserService.getAuthUserOrRedirect();

    return (
        <div className="flex min-h-screen flex-col">
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
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        </div>
    );
}
