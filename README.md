# Expense Tracker AI

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![No Backend](https://img.shields.io/badge/backend-none-lightgrey?style=flat-square)
![Privacy](https://img.shields.io/badge/data-local_only-teal?style=flat-square)

**Personal expense tracking with smart categorisation, visual analytics, and CSV export — entirely in your browser.**

[Features](#features) · [Getting Started](#getting-started) · [Usage](#usage) · [Architecture](#architecture) · [Privacy](#privacy)

</div>

---

Expense Tracker AI is a clean, fast personal finance app built on Next.js 16. Log expenses by category, filter and search your history, visualise monthly trends and category breakdowns with interactive charts, then export everything to CSV in one click.

> 🔒 **All data stays on your device.** Nothing is ever transmitted to a server. Expenses are persisted only to your browser's `localStorage`.

---

## Features

### ➕ Quick Add Form
Add an expense in seconds — amount, category, description, and date. The form sits at the top of the dashboard so logging is never more than one click away.

### 📊 Summary Cards
Four at-a-glance metrics update instantly as you add or delete expenses:

| Card | Shows |
|---|---|
| Total Spending | Lifetime total across all expenses |
| Monthly Spending | Spending in the current calendar month |
| Average Expense | Mean value per transaction |
| Expense Count | Total number of logged transactions |

### 📈 Spending Charts
Two interactive Recharts visualisations:
- **Category Breakdown** — chart showing spend distribution across all 6 categories
- **Monthly Trend** — line chart of total spending per month over your full history

### 🗂️ Expense List & Filters
Full transaction history with real-time filtering by:
- **Search** — free-text match on description
- **Category** — dropdown filter across all 6 categories
- **Date Range** — start and end date pickers

### ✏️ Edit & Delete
Click any expense to edit any field in-place, or delete it permanently. Changes are reflected immediately across all summary cards and charts.

### 📤 Export to CSV
Export your full expense history as a dated CSV file — `expenses-YYYY-MM-DD.csv` — ready for import into Excel, Google Sheets, or any accounting tool.

### 🌙 Dark Mode
Full dark-mode support via Tailwind CSS. Follows your system preference automatically.

---

## Categories

| Category | Icon | Colour |
|---|---|---|
| Food | 🍔 | Emerald |
| Transportation | 🚗 | Blue |
| Entertainment | 🎬 | Violet |
| Shopping | 🛍️ | Amber |
| Bills | 📄 | Red |
| Other | 📦 | Grey |

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 | App Router, SSR scaffolding, routing |
| [React](https://react.dev/) | 19 | UI, hooks, client components |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety across all components and hooks |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling, dark mode |
| [Recharts](https://recharts.org/) | 3 | Category breakdown chart + monthly trend line |
| [date-fns](https://date-fns.org/) | 4 | Date formatting and monthly grouping |
| [uuid](https://github.com/uuidjs/uuid) | 13 | Stable unique IDs for each expense record |

**No backend. No database. No auth. No external API calls.**

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/dnd1097/expense-tracker-ai.git
cd expense-tracker-ai
npm install
```

### Development

```bash
npm run dev
# → http://localhost:3000
```

### Production Build

```bash
npm run build     # outputs to /.next
npm run start     # serves the production build
```

---

## Usage

1. **Add an expense** — fill in the amount, pick a category, add a description and date, then hit *Add Expense*.
2. **View your dashboard** — summary cards and charts update immediately to reflect your new entry.
3. **Browse history** — switch to the *Expenses* tab to see your full transaction list.
4. **Filter** — use the search box, category dropdown, or date range pickers to narrow the list.
5. **Edit or delete** — click any expense row to modify or remove it.
6. **Export** — click *Export Data* to download a CSV of your full history.

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx              — root layout, global fonts & metadata
│   ├── page.tsx                — entry point, renders <ExpenseApp>
│   └── globals.css             — Tailwind base + custom overrides
├── components/
│   ├── ExpenseApp.tsx          — root client component, tab state
│   ├── dashboard/
│   │   ├── SummaryCards.tsx    — four KPI metric cards
│   │   └── SpendingCharts.tsx  — category + monthly Recharts charts
│   ├── expenses/
│   │   ├── ExpenseForm.tsx     — add / quick-add form
│   │   ├── ExpenseList.tsx     — paginated transaction list
│   │   ├── ExpenseItem.tsx     — single row with edit / delete actions
│   │   ├── ExpenseFilters.tsx  — search, category, date range controls
│   │   └── ExportButton.tsx    — triggers CSV download
│   ├── export/
│   │   └── ExportModal.tsx     — export options modal
│   ├── layout/
│   │   └── Header.tsx          — sticky header + tab navigation
│   └── ui/
│       ├── Button.tsx          — shared button variants
│       ├── Card.tsx            — card wrapper with shadow
│       ├── Input.tsx           — styled text / date input
│       ├── Modal.tsx           — accessible modal overlay
│       └── Select.tsx          — styled select dropdown
├── hooks/
│   └── useExpenses.ts          — all expense state, CRUD, filtering, summary
├── lib/
│   ├── storage.ts              — localStorage read / write helpers
│   └── utils.ts                — formatCurrency, downloadCSV, date helpers
└── types/
    └── expense.ts              — Expense, ExpenseFormData, ExpenseFilters, ExpenseSummary types
```

### Key Design Decisions

- **Single custom hook** — `useExpenses` owns all state and business logic. Components are purely presentational and receive data/callbacks as props.
- **No backend** — `localStorage` is the only persistence layer, keyed by expense `id`.
- **CSV export format**:
  ```
  id,amount,category,description,date,createdAt,updatedAt
  ```
- **Monthly trend grouping** — expenses are bucketed by `YYYY-MM` using `date-fns/format`, then sorted chronologically for chart rendering.
- **Dark mode** — Tailwind's `dark:` variant classes throughout; no JavaScript theme toggle required.

---

## Privacy

Expense Tracker AI was deliberately designed with no server component:

- ✅ No analytics, tracking, or telemetry
- ✅ No network requests at runtime
- ✅ All computation runs in the browser
- ✅ Expense data never leaves your device unless you explicitly export it
- ✅ Clearing your browser's site data removes all stored expenses

---

## Disclaimer

Expense Tracker AI is a personal budgeting tool and does **not** constitute financial or tax advice. Exported data is provided as-is for personal record-keeping only.

---

## License

MIT

---

<div align="center">
  <sub>Built with Next.js + TypeScript · Designed for personal use</sub>
</div>
