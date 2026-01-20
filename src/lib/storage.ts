import { Expense } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-expenses';

export function getExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Expense[];
  } catch (error) {
    console.error('Error reading expenses from localStorage:', error);
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses to localStorage:', error);
  }
}

export function addExpense(expense: Expense): Expense[] {
  const expenses = getExpenses();
  const updatedExpenses = [expense, ...expenses];
  saveExpenses(updatedExpenses);
  return updatedExpenses;
}

export function updateExpense(id: string, updates: Partial<Expense>): Expense[] {
  const expenses = getExpenses();
  const updatedExpenses = expenses.map((expense) =>
    expense.id === id
      ? { ...expense, ...updates, updatedAt: new Date().toISOString() }
      : expense
  );
  saveExpenses(updatedExpenses);
  return updatedExpenses;
}

export function deleteExpense(id: string): Expense[] {
  const expenses = getExpenses();
  const updatedExpenses = expenses.filter((expense) => expense.id !== id);
  saveExpenses(updatedExpenses);
  return updatedExpenses;
}

export function getExpenseById(id: string): Expense | undefined {
  const expenses = getExpenses();
  return expenses.find((expense) => expense.id === id);
}
