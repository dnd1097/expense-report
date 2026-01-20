# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ExpenseTracker is a personal finance management web application built with Next.js 14. It allows users to track expenses, view spending analytics, and export data.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Data**: localStorage (client-side persistence)

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Main entry point, renders ExpenseApp
│   └── globals.css        # Global styles and Tailwind imports
├── components/
│   ├── ExpenseApp.tsx     # Main app component with state management
│   ├── ui/                # Reusable UI components (Button, Input, Card, Modal, Select)
│   ├── expenses/          # Expense-specific components
│   │   ├── ExpenseForm.tsx    # Add/edit expense form with validation
│   │   ├── ExpenseList.tsx    # Expense list with loading states
│   │   ├── ExpenseItem.tsx    # Individual expense row
│   │   ├── ExpenseFilters.tsx # Search, category, and date filters
│   │   └── ExportButton.tsx   # CSV export functionality
│   ├── dashboard/         # Dashboard components
│   │   ├── SummaryCards.tsx   # Stat cards (total, monthly, average)
│   │   └── SpendingCharts.tsx # Bar chart and pie chart visualizations
│   └── layout/
│       └── Header.tsx     # Navigation header with tab switching
├── hooks/
│   └── useExpenses.ts     # Main hook for expense state management
├── lib/
│   ├── storage.ts         # localStorage CRUD operations
│   └── utils.ts           # Formatting, filtering, calculations, CSV export
└── types/
    └── expense.ts         # TypeScript types, categories, and constants
```

### Data Flow
1. `useExpenses` hook manages all expense state and syncs with localStorage
2. `ExpenseApp` component coordinates between dashboard/expenses views
3. Components receive data and callbacks via props
4. localStorage persists data across sessions

### Key Patterns
- **State Management**: Custom React hook (`useExpenses`) centralizes all expense operations
- **Component Composition**: UI primitives (Button, Input, Card) are composed into feature components
- **Type Safety**: All data structures defined in `src/types/expense.ts`
- **Client Components**: Components using hooks/state are marked with `'use client'`

### Expense Categories
Food, Transportation, Entertainment, Shopping, Bills, Other - defined in `EXPENSE_CATEGORIES` array with corresponding colors and icons.
