# Folder Structure

This document explains the purpose of each folder in the project.

```
src
├── api
├── components
├── features
├── layouts
├── lib
├── App.tsx
├── main.tsx
├── fonts.css
└── index.css
```

---

# `api`

Global API configuration.

```
api/
 ├─ axios-client.ts
 └─ endpoints/
```

Responsibilities:

- Axios configuration
- Base URL
- Interceptors
- Shared endpoints

---

# `components`

Reusable UI components.

```
components/
 └─ ui/
      container.tsx
      section.tsx
```

These components should **not contain business logic**.

They should only handle:

- Layout
- Styling
- Composition

---

# `features`

Main application features.

```
features/
 ├─ announcements/
 ├─ auth/
 └─ home/
```

Each feature is **self-contained**.

---

# `layouts`

Application layouts.

Example:

```
layouts/
  guest-layout.tsx
```

Layouts wrap pages and define the overall page structure.

Example responsibilities:

- Navbar
- Footer
- Page padding
- Auth guards

---

# `lib`

Utility functions and shared helpers.

Examples:

```
lib/
  format-date.ts
  storage.ts
  constants.ts
```

Rules:

- Must be framework-agnostic when possible
- Should not depend on React components

---

# Root Files

### `App.tsx`

Application root component.

Responsibilities:

- Routing
- Global providers
- Layout injection

---

### `main.tsx`

Application entry point.

Responsibilities:

- React mounting
- Global providers
- CSS imports
