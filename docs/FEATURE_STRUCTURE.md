# Feature Structure

Each feature follows a **consistent internal structure**.

Example:

```
features/auth
 ├─ api
 ├─ components
 ├─ pages
 ├─ queries
 ├─ auth.routes.ts
 └─ auth.types.ts
```

---

# `api`

Feature-specific API calls.

Example:

```
api/
  login.ts
  register.ts
```

These files use the shared axios client.

Example:

```ts
import api from "@/api/axios-client";

export const login = (data: LoginPayload) => {
  return api.post("/auth/login", data);
};
```

---

# `components`

Components used only inside the feature.

Example:

```
components/
  login-form.tsx
  register-form.tsx
```

Rules:

- Do not export these globally
- Keep feature UI isolated

---

# `pages`

Page-level components.

Example:

```
pages/
  login-page.tsx
  register-page.tsx
```

if the feature has both backend modules:

```
pages/
    admin/
        donation-page.tsx
        create-donation-page.tsx
        update-donation-page.tsx
    client/ (for client dashboard)
        donation-page.tsx
```

Pages typically:

- compose components
- connect queries
- manage layout

---

# `queries`

Data fetching hooks.

Example:

```
queries/
  useLogin.ts
  useCurrentUser.ts
```

If using **TanStack Query**, this layer handles:

- fetching
- caching
- mutation

---

# `auth.routes.ts`

Defines feature routes.

Example:

```ts
export const authRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  }
];
```

---

# `auth.types.ts`

Feature-specific TypeScript types.

Example:

```
LoginPayload
User
AuthResponse
```

Keeping types inside the feature prevents global pollution.

---

# Feature Independence

A feature should **not depend on another feature directly**.

Allowed imports:

```
features → api
features → components/ui
features → lib
```

Avoid:

```
features/auth → features/home
```

---

# Example Flow

Login flow example:

```
login-page
   ↓
login-form
   ↓
useLogin (query)
   ↓
auth/api/login
   ↓
axios-client
```

This separation keeps code clean and maintainable.
