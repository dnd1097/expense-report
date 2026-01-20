'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseFormData, ExpenseFilters, ExpenseSummary } from '@/types/expense';
import { getExpenses, saveExpenses, deleteExpense as deleteFromStorage } from '@/lib/storage';
import { filterExpenses, calculateSummary } from '@/lib/utils';

const initialFilters: ExpenseFilters = {
  search: '',
  category: 'All',
  startDate: '',
  endDate: '',
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = getExpenses();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveExpenses(expenses);
    }
  }, [expenses, isLoading]);

  const addExpense = useCallback((formData: ExpenseFormData) => {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      id: uuidv4(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      createdAt: now,
      updatedAt: now,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const updateExpense = useCallback((id: string, formData: ExpenseFormData) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              amount: parseFloat(formData.amount),
              category: formData.category,
              description: formData.description,
              date: formData.date,
              updatedAt: new Date().toISOString(),
            }
          : expense
      )
    );
    setEditingExpense(null);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const startEditing = useCallback((expense: Expense) => {
    setEditingExpense(expense);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingExpense(null);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ExpenseFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Computed values
  const filteredExpenses = filterExpenses(expenses, filters);
  const summary: ExpenseSummary = calculateSummary(expenses);
  const filteredSummary: ExpenseSummary = calculateSummary(filteredExpenses);

  return {
    expenses,
    filteredExpenses,
    filters,
    summary,
    filteredSummary,
    isLoading,
    editingExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    startEditing,
    cancelEditing,
    updateFilters,
    resetFilters,
  };
}
