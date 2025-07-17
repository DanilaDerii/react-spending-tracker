import defaultCategories from '../data/spending-categories.json';

const CATEGORIES_KEY = 'spendingTrackerCategories';
const ENTRIES_KEY    = 'spendingTrackerEntries';

export function getCategories() {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (!stored) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  return JSON.parse(stored);
}

export function saveCategory({ category, description = '' }) {
  const cats = getCategories();
  const newCat = { spending_id: cats.length + 1, category, description };
  cats.push(newCat);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  return cats;
}

export function getEntries() {
  const stored = localStorage.getItem(ENTRIES_KEY);
  if (!stored) {
    localStorage.setItem(ENTRIES_KEY, '[]');
    return [];
  }
  return JSON.parse(stored);
}

export function saveEntry({ date, category, amount }) {
  const entries = getEntries();
  const newEntry = { id: Date.now(), date, category, amount: Number(amount) };
  entries.push(newEntry);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  return entries;
}
