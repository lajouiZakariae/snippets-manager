import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export class AuthUserService {
    static async getAuthUser() {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.getClaims();

        return error || !data?.claims ? null : data.claims;
    }

    static async getAuthUserOrRedirect() {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getClaims();

        if (error || !data?.claims) {
            redirect('/auth/login');
        }

        return data.claims;
    }
}
