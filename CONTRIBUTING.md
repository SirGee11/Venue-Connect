# Contributing to Venue Connect

## Branch Rules

Do not directly push new features to `main`.

Use feature branches.

### Feature

```text
feature/feature-name
```

Example:

```text
feature/venue-search
```

### Bug Fix

```text
fix/problem-name
```

Example:

```text
fix/booking-validation
```

### Documentation

```text
docs/document-name
```

Example:

```text
docs/use-case-diagram
```

## Development Workflow

Before starting work:

```bash
git checkout develop
git pull origin develop
```

Create a branch:

```bash
git checkout -b feature/your-feature
```

After completing your work:

```bash
git add .
git commit -m "feat: describe your feature"
git push -u origin feature/your-feature
```

Create a Pull Request on GitHub.

## Commit Convention

Use clear commit messages.

Examples:

```text
feat: add venue registration
feat: add venue search
feat: add booking system
fix: fix login validation
fix: fix venue availability
docs: add use case diagram
docs: update system requirements
test: add booking tests
refactor: improve venue service
```

## Important Rules

* Do not commit passwords or API keys.
* Do not commit `.env` files.
* Do not directly push unfinished features to `main`.
* Pull the latest `develop` changes before starting new work.
* Keep commits small and meaningful.
* Test your code before creating a Pull Request.
* Do not delete another member's work without discussing it with the team.
