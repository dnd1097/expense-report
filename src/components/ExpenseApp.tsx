'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import Header from '@/components/layout/Header';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SpendingCharts from '@/components/dashboard/SpendingCharts';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpenseFilters from '@/components/expenses/ExpenseFilters';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExportButton from '@/components/expenses/ExportButton';
import Modal from '@/components/ui/Modal';

export default function ExpenseApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses'>('dashboard');
  const {
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
  } = useExpenses();

  const handleEditSubmit = (formData: any) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            {/* Quick Add Form */}
            <ExpenseForm onSubmit={addExpense} />

            {/* Summary Cards */}
            <SummaryCards summary={summary} />

            {/* Charts */}
            <SpendingCharts summary={summary} />

            {/* Recent Expenses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recent Expenses
                </h2>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all
                </button>
              </div>
              <ExpenseList
                expenses={expenses.slice(0, 5)}
                onEdit={startEditing}
                onDelete={deleteExpense}
                isLoading={isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Expense Form */}
            <ExpenseForm onSubmit={addExpense} />

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <ExpenseFilters
                  filters={filters}
                  onFilterChange={updateFilters}
                  onReset={resetFilters}
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Expenses
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredExpenses.length} of {expenses.length} expenses
                </p>
              </div>
              <ExportButton expenses={filteredExpenses} />
            </div>

            {/* Expense List */}
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={startEditing}
              onDelete={deleteExpense}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={cancelEditing}
        title="Edit Expense"
      >
        <ExpenseForm
          onSubmit={handleEditSubmit}
          onCancel={cancelEditing}
          editingExpense={editingExpense}
          isEditing
        />
      </Modal>
    </div>
  );
}
