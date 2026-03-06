# Contributing Guidelines

Thank you for considering contributing to this project! We appreciate your time and effort in helping us improve.

---

## 🚀 Commit & Branch Naming

### Commit Message Format

Use the following prefixes for commit messages:

- `feat:[description]` - New feature / functionality
- `fix:[description]` - Bug fix
- `hotfix:[description]` - Critical production fix
- `chore:[description]` - Maintenance / tooling / dependency updates
- `docs:[description]` - Documentation changes
- `style:[description]` - Formatting / lint / styling changes
- `refactor:[description]` - Code refactor (no feature / no bug)
- `test:[description]` - Add or modify tests

**Examples**

- `feat:user-login-page`
- `fix:login-validation`
- `docs:update-setup-guide`
- `refactor:auth-service`

---

### Branch Naming

Use the following format for branch names:

- `feat/[description]` - Feature development
- `fix/[description]` - Bug fix
- `hotfix/[description]` - Production hotfix
- `chore/[description]` - Maintenance tasks
- `release/[description]` - Release preparation
- `test/[description]` - Testing related changes

**Examples**

- `feat/user-authentication`
- `fix/login-validation`
- `hotfix/token-refresh-error`
- `chore/update-dependencies`
- `release/v1.0.0`
- `test/auth-api`

---

## 📂 File Naming Convention

Use **kebab-case** for file names.

### React Components

Component files should use **kebab-case**, while the component name inside the file remains **PascalCase**.

Examples:

- `user-card.tsx`
- `login-form.tsx`
- `dashboard-layout.tsx`

---

### Hooks

Hooks should use **camelCase** and must start with `use`.

Examples:

- `useAuth.ts`
- `useFetch.ts`

---

### Utility / Helper Files

Utility files should use **camelCase**.

Examples:

- `formatDate.ts`
- `authService.ts`

---

## 🤝 Pull Requests

- Keep PRs small and focused on a single feature or fix.
- Link related issues in the PR description.
- Request at least one reviewer before merging.
- Ensure the project builds successfully before submitting.
- Update documentation if necessary.
