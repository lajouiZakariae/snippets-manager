import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LogoutButton } from '@/components/logout-button';
import { AuthUserService } from '@/services/auth-user-service';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    await AuthUserService.getAuthUserOrRedirect();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
                    <Link
                        href="/protected/snippets"
                        className="flex items-center gap-2 font-semibold text-sm hover:opacity-80 transition-opacity"
                    >
                        <Code2 className="h-5 w-5" />
                        Snippets Manager
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <LogoutButton />
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
        </div>
    );
}
