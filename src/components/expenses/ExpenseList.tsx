'use client';

import { Expense } from '@/types/expense';
import ExpenseItem from './ExpenseItem';
import Card from '@/components/ui/Card';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ExpenseList({ expenses, onEdit, onDelete, isLoading }: ExpenseListProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-5xl mb-4">💸</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No expenses found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Start tracking your spending by adding your first expense above.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
