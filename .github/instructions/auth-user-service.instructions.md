---
description: 'Use when accessing the authenticated user, checking auth state, protecting routes, or redirecting unauthenticated users. Enforces use of AuthUserService methods instead of calling supabase.auth directly.'
applyTo: 'app/**/*.{ts,tsx}'
---

# Auth User Access

Always use `AuthUserService` from `@/services/auth-user-service` to access the authenticated user. Never call `supabase.auth.getUser()`, `supabase.auth.getClaims()`, or any other `supabase.auth.*` method directly in pages, layouts, or route handlers.

## Methods

- **`AuthUserService.getAuthUser()`** — Returns the user's claims or `null`. Use when auth is optional and you want to handle both states.
- **`AuthUserService.getAuthUserOrRedirect()`** — Returns the user's claims or redirects to `/auth/login`. Use for protected pages/layouts where unauthenticated access is not allowed.

## Examples

```ts
// Protected page or layout — redirect if not authenticated
const claims = await AuthUserService.getAuthUserOrRedirect();

// Page where auth is optional
const claims = await AuthUserService.getAuthUser();
if (!claims) {
    // handle unauthenticated state
}
```

## Rules

- Do not instantiate a Supabase client just to check authentication — use `AuthUserService` instead.
- Do not duplicate the redirect-or-return logic inline; use `getAuthUserOrRedirect()`.
- Import path: `import { AuthUserService } from '@/services/auth-user-service'` (note: the class must be exported).
