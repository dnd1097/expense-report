'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseFormData, ExpenseCategory, EXPENSE_CATEGORIES, CATEGORY_ICONS } from '@/types/expense';
import { getTodayISO } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  editingExpense?: Expense | null;
  isEditing?: boolean;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
}

export default function ExpenseForm({
  onSubmit,
  onCancel,
  editingExpense,
  isEditing = false,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: '',
    category: 'Food',
    description: '',
    date: getTodayISO(),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        description: editingExpense.description,
        date: editingExpense.date,
      });
    }
  }, [editingExpense]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    } else if (amount > 999999999) {
      newErrors.amount = 'Amount is too large';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      onSubmit(formData);
      if (!isEditing) {
        // Reset form after successful add
        setFormData({
          amount: '',
          category: 'Food',
          description: '',
          date: getTodayISO(),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const categoryOptions = EXPENSE_CATEGORIES.map((cat) => ({
    value: cat,
    label: `${CATEGORY_ICONS[cat]} ${cat}`,
  }));

  return (
    <Card className={isEditing ? 'border-0 shadow-none p-0' : ''}>
      {!isEditing && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Add New Expense
        </h2>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="amount"
            label="Amount ($)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={errors.amount}
          />
          <Input
            id="date"
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            error={errors.date}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EXPENSE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleChange('category', category)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  formData.category === category
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{CATEGORY_ICONS[category]}</span>
                <span className="text-sm">{category}</span>
              </button>
            ))}
          </div>
        </div>

        <Input
          id="description"
          label="Description"
          type="text"
          placeholder="What did you spend on?"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
        />

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
          </Button>
          {isEditing && onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
