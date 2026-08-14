// Mock expense service — all functions return Promises with an 800ms simulated delay.
import { CATEGORIES } from '../constants/categories';

const DELAY_MS = 800;

// Mutable array with 6 seed expenses.
let expenses = [
  { id: '1', title: 'Almuerzo en restaurante', amount: 3500, category: 'food', date: '2026-08-13', note: null },
  { id: '2', title: 'Boleto de colectivo', amount: 650, category: 'transport', date: '2026-08-13', note: null },
  { id: '3', title: 'Entrada de cine', amount: 4200, category: 'entertainment', date: '2026-08-12', note: null },
  { id: '4', title: 'Factura de internet', amount: 12800, category: 'services', date: '2026-08-10', note: null },
  { id: '5', title: 'Farmacia — Ibuprofeno', amount: 1900, category: 'health', date: '2026-08-09', note: null },
  { id: '6', title: 'Remera nueva', amount: 15000, category: 'shopping', date: '2026-08-08', note: null },
];

// Counter used to generate unique IDs for new expenses.
let nextId = 7;

/**
 * Returns all expenses sorted by date descending (most recent first).
 * @returns {Promise<Array>}
 */
export function getExpenses() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));
      resolve(sorted);
    }, DELAY_MS);
  });
}

/**
 * Finds a single expense by its ID.
 * @param {string} id - The expense ID to look up.
 * @returns {Promise<Object|null>} The expense object or null if not found.
 */
export function getExpenseById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const expense = expenses.find((e) => e.id === id) || null;
      resolve(expense);
    }, DELAY_MS);
  });
}

/**
 * Adds a new expense to the in-memory array.
 * Generates a unique ID automatically.
 * @param {Object} data - Expense data ({ title, amount, category, date, note }).
 * @returns {Promise<Object>} The newly created expense with its generated ID.
 */
export function addExpense(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newExpense = {
        id: String(nextId++),
        title: data.title,
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        note: data.note || null,
      };
      expenses.push(newExpense);
      resolve(newExpense);
    }, DELAY_MS);
  });
}

/**
 * Groups expenses by category and calculates totals and percentages.
 * Returns an array of CategorySummary objects sorted by total descending.
 * @returns {Promise<Array<{ category: string, label: string, icon: string, total: number, percentage: number, count: number }>>}
 */
export function getExpensesByCategory() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate grand total across all expenses.
      const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

      // Build a map of category key → accumulated data.
      const categoryMap = {};
      expenses.forEach((expense) => {
        if (!categoryMap[expense.category]) {
          categoryMap[expense.category] = { total: 0, count: 0 };
        }
        categoryMap[expense.category].total += expense.amount;
        categoryMap[expense.category].count += 1;
      });

      // Merge with category metadata (label, icon) and compute percentages.
      const result = CATEGORIES
        .filter((cat) => categoryMap[cat.key])
        .map((cat) => ({
          category: cat.key,
          label: cat.label,
          icon: cat.icon,
          total: categoryMap[cat.key].total,
          percentage: grandTotal > 0
            ? Math.round((categoryMap[cat.key].total / grandTotal) * 100)
            : 0,
          count: categoryMap[cat.key].count,
        }))
        .sort((a, b) => b.total - a.total);

      resolve(result);
    }, DELAY_MS);
  });
}
