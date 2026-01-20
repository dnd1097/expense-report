import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { Expense, ExpenseCategory, ExpenseFilters, ExpenseSummary, EXPENSE_CATEGORIES } from '@/types/expense';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy');
}

export function formatDateShort(dateString: string): string {
  return format(parseISO(dateString), 'MM/dd/yyyy');
}

export function formatMonthYear(dateString: string): string {
  return format(parseISO(dateString), 'MMM yyyy');
}

export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter((expense) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(searchLower);
      const matchesCategory = expense.category.toLowerCase().includes(searchLower);
      const matchesAmount = expense.amount.toString().includes(searchLower);
      if (!matchesDescription && !matchesCategory && !matchesAmount) {
        return false;
      }
    }

    // Category filter
    if (filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const expenseDate = parseISO(expense.date);
      if (filters.startDate && expenseDate < parseISO(filters.startDate)) {
        return false;
      }
      if (filters.endDate && expenseDate > parseISO(filters.endDate)) {
        return false;
      }
    }

    return true;
  });
}

export function calculateSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  // Total spending
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Monthly spending (current month)
  const monthlyExpenses = expenses.filter((expense) => {
    const date = parseISO(expense.date);
    return isWithinInterval(date, { start: currentMonthStart, end: currentMonthEnd });
  });
  const monthlySpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Average expense
  const averageExpense = expenses.length > 0 ? totalSpending / expenses.length : 0;

  // Category breakdown
  const categoryBreakdown = EXPENSE_CATEGORIES.reduce((acc, category) => {
    acc[category] = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  // Monthly trend (last 6 months)
  const monthlyTrend: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const monthExpenses = expenses.filter((expense) => {
      const date = parseISO(expense.date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });
    const amount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    monthlyTrend.push({
      month: format(monthDate, 'MMM'),
      amount,
    });
  }

  return {
    totalSpending,
    monthlySpending,
    averageExpense,
    expenseCount: expenses.length,
    categoryBreakdown,
    monthlyTrend,
  };
}

export function exportToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((expense) => [
    formatDateShort(expense.date),
    expense.category,
    `"${expense.description.replace(/"/g, '""')}"`,
    expense.amount.toFixed(2),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function downloadCSV(expenses: Expense[], filename: string = 'expenses.csv'): void {
  const csv = exportToCSV(expenses);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Advanced Export Types
export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  startDate?: string;
  endDate?: string;
  categories: ExpenseCategory[];
}

// Filter expenses for export based on options
export function filterExpensesForExport(
  expenses: Expense[],
  options: ExportOptions
): Expense[] {
  return expenses.filter((expense) => {
    // Category filter
    if (options.categories.length > 0 && !options.categories.includes(expense.category)) {
      return false;
    }

    // Date range filter
    if (options.startDate) {
      const expenseDate = parseISO(expense.date);
      if (expenseDate < parseISO(options.startDate)) {
        return false;
      }
    }
    if (options.endDate) {
      const expenseDate = parseISO(expense.date);
      if (expenseDate > parseISO(options.endDate)) {
        return false;
      }
    }

    return true;
  });
}

// Export to JSON format
export function exportToJSON(expenses: Expense[]): string {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalRecords: expenses.length,
    totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
    expenses: expenses.map((expense) => ({
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
    })),
  };
  return JSON.stringify(exportData, null, 2);
}

// Export to PDF format (generates HTML that opens in print dialog)
export function exportToPDF(expenses: Expense[], filename: string): void {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; }
        h1 { color: #1f2937; margin-bottom: 8px; }
        .subtitle { color: #6b7280; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f3f4f6; text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .amount { text-align: right; font-family: monospace; }
        .total-row { font-weight: bold; background: #f9fafb; }
        .category { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .Food { background: #d1fae5; color: #065f46; }
        .Transportation { background: #dbeafe; color: #1e40af; }
        .Entertainment { background: #ede9fe; color: #5b21b6; }
        .Shopping { background: #fef3c7; color: #92400e; }
        .Bills { background: #fee2e2; color: #991b1b; }
        .Other { background: #f3f4f6; color: #374151; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>Expense Report</h1>
      <p class="subtitle">Generated on ${format(new Date(), 'MMMM d, yyyy')} • ${expenses.length} records</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map(
              (e) => `
            <tr>
              <td>${formatDate(e.date)}</td>
              <td><span class="category ${e.category}">${e.category}</span></td>
              <td>${e.description}</td>
              <td class="amount">${formatCurrency(e.amount)}</td>
            </tr>
          `
            )
            .join('')}
          <tr class="total-row">
            <td colspan="3">Total</td>
            <td class="amount">${formatCurrency(totalAmount)}</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

// Download file based on format
export function downloadExport(expenses: Expense[], options: ExportOptions): void {
  const { format: exportFormat, filename } = options;

  if (exportFormat === 'csv') {
    const csv = exportToCSV(expenses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
  } else if (exportFormat === 'json') {
    const json = exportToJSON(expenses);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    downloadBlob(blob, `${filename}.json`);
  } else if (exportFormat === 'pdf') {
    exportToPDF(expenses, filename);
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
