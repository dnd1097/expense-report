'use client';

import { useState, useMemo, useCallback } from 'react';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES, CATEGORY_COLORS } from '@/types/expense';
import {
  ExportFormat,
  ExportOptions,
  filterExpensesForExport,
  downloadExport,
  formatCurrency,
  formatDate,
  getTodayISO,
} from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; description: string; icon: string }[] = [
  { value: 'csv', label: 'CSV', description: 'Spreadsheet compatible', icon: '📊' },
  { value: 'json', label: 'JSON', description: 'Developer friendly', icon: '{ }' },
  { value: 'pdf', label: 'PDF', description: 'Print-ready report', icon: '📄' },
];

export default function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('expense-report');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Filter expenses based on current options
  const filteredExpenses = useMemo(() => {
    const options: ExportOptions = {
      format,
      filename,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      categories: selectedCategories,
    };
    return filterExpensesForExport(expenses, options);
  }, [expenses, format, filename, startDate, endDate, selectedCategories]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryBreakdown = EXPENSE_CATEGORIES.reduce((acc, cat) => {
      const catExpenses = filteredExpenses.filter((e) => e.category === cat);
      if (catExpenses.length > 0) {
        acc[cat] = {
          count: catExpenses.length,
          total: catExpenses.reduce((sum, e) => sum + e.amount, 0),
        };
      }
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return { total, categoryBreakdown };
  }, [filteredExpenses]);

  // Toggle category selection
  const toggleCategory = useCallback((category: ExpenseCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }, []);

  // Select/deselect all categories
  const toggleAllCategories = useCallback(() => {
    setSelectedCategories((prev) =>
      prev.length === EXPENSE_CATEGORIES.length ? [] : [...EXPENSE_CATEGORIES]
    );
  }, []);

  // Handle export
  const handleExport = useCallback(async () => {
    if (filteredExpenses.length === 0) return;

    setIsExporting(true);

    // Simulate a slight delay for better UX feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    const options: ExportOptions = {
      format,
      filename,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      categories: selectedCategories,
    };

    downloadExport(filteredExpenses, options);
    setIsExporting(false);
    onClose();
  }, [filteredExpenses, format, filename, startDate, endDate, selectedCategories, onClose]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setSelectedCategories([]);
    setFilename('expense-report');
    setFormat('csv');
    setShowPreview(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Export Data</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure your export settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Export Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {FORMAT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    format === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filename Input */}
          <div>
            <Input
              id="filename"
              label="Filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="expense-report"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              File will be saved as: {filename}.{format}
            </p>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="startDate"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || getTodayISO()}
              />
              <Input
                id="endDate"
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={getTodayISO()}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categories
              </label>
              <button
                onClick={toggleAllCategories}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {selectedCategories.length === EXPENSE_CATEGORIES.length
                  ? 'Deselect all'
                  : selectedCategories.length === 0
                    ? 'All categories included'
                    : 'Select all'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map((category) => {
                const isSelected =
                  selectedCategories.length === 0 || selectedCategories.includes(category);
                const color = CATEGORY_COLORS[category];
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2 ${
                      isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-70 border-transparent'
                    }`}
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                      borderColor: isSelected ? color : 'transparent',
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {selectedCategories.length === 0
                ? 'All categories will be exported'
                : `${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'} selected`}
            </p>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Export Summary</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
                <svg
                  className={`w-4 h-4 transition-transform ${showPreview ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {filteredExpenses.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Records to export</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(summary.total)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total amount</div>
              </div>
            </div>

            {/* Category breakdown */}
            {Object.keys(summary.categoryBreakdown).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  By Category
                </div>
                <div className="space-y-2">
                  {Object.entries(summary.categoryBreakdown).map(([cat, data]) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[cat as ExpenseCategory] }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">{cat}</span>
                        <span className="text-gray-400 dark:text-gray-500">({data.count})</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(data.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Table */}
          {showPreview && filteredExpenses.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preview (showing first 10 records)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-400 font-medium">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-400 font-medium">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-400 font-medium">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-gray-600 dark:text-gray-400 font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredExpenses.slice(0, 10).map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${CATEGORY_COLORS[expense.category]}20`,
                              color: CATEGORY_COLORS[expense.category],
                            }}
                          >
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                          {expense.description}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(expense.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredExpenses.length > 10 && (
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                  ... and {filteredExpenses.length - 10} more records
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {filteredExpenses.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 dark:text-gray-400">
                No expenses match your current filters
              </p>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={resetFilters}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Reset all
          </button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={filteredExpenses.length === 0 || isExporting}
              className="min-w-[120px]"
            >
              {isExporting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Exporting...
                </span>
              ) : (
                `Export ${filteredExpenses.length} records`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
