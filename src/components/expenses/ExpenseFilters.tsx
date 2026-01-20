'use client';

import { ExpenseFilters as FilterType, ExpenseCategory, EXPENSE_CATEGORIES, CATEGORY_ICONS } from '@/types/expense';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ExpenseFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
  onReset: () => void;
}

export default function ExpenseFilters({ filters, onFilterChange, onReset }: ExpenseFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.category !== 'All' || filters.startDate || filters.endDate;

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search expenses..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange({ category: 'All' })}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                filters.category === 'All'
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {EXPENSE_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => onFilterChange({ category })}
                className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1 ${
                  filters.category === category
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{CATEGORY_ICONS[category]}</span>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="From Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
          />
          <Input
            label="To Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
