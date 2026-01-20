'use client';

import { Expense } from '@/types/expense';
import { downloadCSV } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ExportButtonProps {
  expenses: Expense[];
  disabled?: boolean;
}

export default function ExportButton({ expenses, disabled }: ExportButtonProps) {
  const handleExport = () => {
    const filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(expenses, filename);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={disabled || expenses.length === 0}
      className="flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      <span>Export CSV</span>
    </Button>
  );
}
