# Frontend Architecture

This project follows a **Feature-Based Architecture**.
Instead of grouping files by type (components, hooks, services), we group them by **domain feature**.

This improves:

- Scalability
- Maintainability
- Team collaboration
- Feature isolation

Each feature contains everything it needs: **API logic, UI components, pages, and data queries.**

---

# Core Principles

## 1. Feature Isolation

Each feature lives inside `src/features`.

Example:

```
features/
  auth/
  announcements/
  home/
```

Each feature manages its own:

- components
- api calls
- queries
- pages
- types
- routes

This prevents cross-feature coupling.

---

## 2. Shared Code Separation

Reusable or global code lives outside `features`.

| Folder          | Purpose                            |
| --------------- | ---------------------------------- |
| `components/ui` | Reusable design system components  |
| `api`           | Global API client & base endpoints |
| `layouts`       | Page layouts                       |
| `lib`           | Utilities / helpers                |

---

## 3. Clear Layer Boundaries

```
UI Layer
↓
Feature Components
↓
Queries / Hooks
↓
API Layer
↓
Backend
```

Responsibilities:

| Layer   | Responsibility            |
| ------- | ------------------------- |
| UI      | Presentational components |
| Queries | Data fetching & caching   |
| API     | HTTP requests             |
| Backend | Business logic            |

---

## 4. Design System

Shared UI components live in:

```
src/components/ui
```

Examples:

```
container.tsx
section.tsx
button.tsx
card.tsx
```

These components should be:

- reusable
- stateless
- style-focused
- framework-agnostic when possible

---

## 5. Global API Layer

All HTTP requests use a shared axios instance.

Location:

```
src/api/axios-client.ts
```

Responsibilities:

- Base URL configuration
- Headers
- Auth token handling
- Error handling
- Request/response interceptors

Feature APIs extend this client.

---

## 6. Routing

Feature routes live inside the feature itself.

Example:

```
features/auth/auth.routes.ts
```

This keeps routing logic close to the feature implementation.

---

# Architecture Overview

```
src
├── api
│   ├── axios-client.ts
│   └── endpoints
│
├── components
│   └── ui
│
├── features
│   ├── auth
│   ├── announcements
│   └── home
│
├── layouts
│
├── lib
│
├── App.tsx
└── main.tsx
```

---

# Benefits of This Architecture

✅ Scales well with large teams
✅ Reduces merge conflicts
✅ Encourages modular design
✅ Makes features easier to remove or refactor
