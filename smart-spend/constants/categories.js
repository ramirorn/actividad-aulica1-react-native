// Predefined expense categories with Spanish labels and emoji icons.

export const CATEGORIES = [
  { key: 'food', label: 'Alimentación', icon: '🍔' },
  { key: 'transport', label: 'Transporte', icon: '🚌' },
  { key: 'entertainment', label: 'Entretenimiento', icon: '🎬' },
  { key: 'services', label: 'Servicios', icon: '💡' },
  { key: 'health', label: 'Salud', icon: '💊' },
  { key: 'shopping', label: 'Compras', icon: '🛍️' },
  { key: 'other', label: 'Otros', icon: '📦' },
];

/**
 * Looks up a category object by its key.
 * @param {string} key - Category key (e.g. "food").
 * @returns {{ key: string, label: string, icon: string } | undefined}
 */
export function getCategoryByKey(key) {
  return CATEGORIES.find((cat) => cat.key === key);
}
