# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

ExpenseTracker is a Next.js 14 web app for personal finance management. Users can track expenses, view analytics with charts, and export data in multiple formats (CSV, JSON, PDF). Data persists in localStorage.

**Tech Stack**: Next.js 14 (App Router), TypeScript, React 19, Tailwind CSS v4, Recharts, date-fns

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Architecture

### Structure
```
src/
├── app/                    # Next.js pages (layout, page, globals.css)
├── components/
│   ├── ExpenseApp.tsx     # Main container component
│   ├── ui/                # Reusable primitives (Button, Input, Card, Modal, Select)
│   ├── expenses/          # Expense CRUD components
│   ├── export/            # Data export components
│   ├── dashboard/         # Analytics/charts
│   └── layout/            # Navigation
├── hooks/
│   └── useExpenses.ts     # Central state management hook
├── lib/
│   ├── storage.ts         # localStorage operations
│   └── utils.ts           # Formatting, filtering, calculations, export
└── types/
    └── expense.ts         # TypeScript types and constants
```

### Key Patterns

**Data Flow**: User action → ExpenseApp → useExpenses hook → setState → localStorage sync → re-render

**State Management**: Custom `useExpenses` hook is the single source of truth. All CRUD operations flow through it. No prop drilling beyond 2 levels.

**Type System**: All types defined in `src/types/expense.ts`. Strict TypeScript mode enabled. Use interfaces, not inline types.

**Client Components**: All components use `'use client'` directive due to interactivity needs.

## Standards & Conventions

### Code Style

- **Components**: PascalCase files, functional components only, destructure props in signature
- **Hooks**: camelCase with `use` prefix
- **Utils**: camelCase functions
- **Constants**: SCREAMING_SNAKE_CASE
- **Immutability**: Never mutate state directly - always use spread operators or `.map()`/`.filter()`
- **Imports**: Order by React → third-party → local types → components → utils

### Best Practices

**DO**:
- Use TypeScript interfaces for all props and data structures
- Use Tailwind utility classes for styling (no inline styles except dynamic colors)
- Handle loading and empty states explicitly
- Use date-fns for date manipulation (not native Date)
- Memoize expensive calculations with `useMemo`/`useCallback`
- Validate user input before processing

**DON'T**:
- Use `any` type - prefer `unknown` or proper types
- Create CSS modules or inline styles (use Tailwind)
- Access localStorage directly (use `src/lib/storage.ts`)
- Mix server/client component logic
- Skip error handling for user inputs
- Create abstractions prematurely - keep it simple

### Important Gotchas

1. **localStorage SSR**: Already handled in `storage.ts` with window checks - don't access directly
2. **Amount storage**: Store as `number`, not `string` - use `parseFloat()` when converting form input
3. **Date format**: ISO strings (`yyyy-MM-dd`) for consistency
4. **Dynamic Tailwind**: Can't use `className="text-${color}-500"` - use inline styles for dynamic colors
5. **Expense categories**: Defined as constants in `types/expense.ts` - update all 3 objects when adding new categories

## Data Model

**Core Types**: `Expense`, `ExpenseCategory`, `ExpenseFilters`, `ExpenseSummary`, `ExportOptions`

**Categories**: Food, Transportation, Entertainment, Shopping, Bills, Other (each has color + icon in `types/expense.ts`)

**Export Formats**: CSV (spreadsheet), JSON (with metadata), PDF (print dialog)

## Common Tasks

**Add expense category**: Update type union, EXPENSE_CATEGORIES array, CATEGORY_COLORS, CATEGORY_ICONS in `types/expense.ts`

**Add export format**: Update ExportFormat type, add export function in `utils.ts`, update ExportModal UI

**Add filter**: Update ExpenseFilters interface, modify filterExpenses function, update ExpenseFilters component

**Add summary stat**: Update ExpenseSummary interface, modify calculateSummary function, display in dashboard

## Performance Notes

- localStorage works well for <1000 expenses
- Consider virtualization (react-window) for large lists
- Recharts is largest dependency (~150KB gzipped)
- All filtering/calculations are client-side

## Future Considerations

When scaling: add backend API, move to PostgreSQL/Prisma, add authentication (NextAuth.js), consider IndexedDB for offline support.

---

**Version**: 2.0 | Keep this file concise and high-level. For implementation details, refer to code comments and TypeScript types.
