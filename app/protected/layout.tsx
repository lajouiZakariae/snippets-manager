import Header from '@/components/layout/header';
import { AuthUserService } from '@/lib/services/auth-user-service';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    await AuthUserService.getAuthUserOrRedirect();

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        </div>
    );
}
