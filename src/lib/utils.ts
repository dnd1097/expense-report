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

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
