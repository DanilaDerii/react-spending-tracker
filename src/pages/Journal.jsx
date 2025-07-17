// src/pages/Journal.jsx
import React, { useState, useEffect } from 'react';
import {
  getCategories,
  saveCategory,
  getEntries,
  saveEntry
} from '../utils/storage';

export default function Journal() {
  const [date, setDate]         = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount]     = useState('');
  const [newCat, setNewCat]     = useState('');
  const [categories, setCategories] = useState([]);
  const [entries, setEntries]       = useState([]);

  useEffect(() => {
    const cats = getCategories();
    setCategories(cats);
    if (cats[0]) setCategory(cats[0].category);
    setEntries(getEntries());
  }, []);

  const addEntry = e => {
    e.preventDefault();
    setEntries(saveEntry({ date, category, amount }));
    setDate('');
    setAmount('');
  };

  const addCategory = e => {
    e.preventDefault();
    const updated = saveCategory({ category: newCat, description: '' });
    setCategories(updated);
    setCategory(updated[0].category);
    setNewCat('');
  };

  return (
    <div>
      <h1>Journal</h1>
      <form onSubmit={addEntry}>
        <label>
          Date:<input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </label>
        <label>
          Category:
          <select value={category} onChange={e => setCategory(e.target.value)} required>
            {categories.map(c => <option key={c.spending_id} value={c.category}>{c.category}</option>)}
          </select>
        </label>
        <label>
          Amount:<input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        </label>
        <button type="submit">Save Entry</button>
      </form>

      <form onSubmit={addCategory} style={{ marginTop: '1rem' }}>
        <label>
          New Category:<input type="text" value={newCat} onChange={e => setNewCat(e.target.value)} required />
        </label>
        <button type="submit">Add Category</button>
      </form>

      <h2>Recent Entries</h2>
      <ul>
        {entries.map(en => <li key={en.id}>{en.date} — {en.category} — {en.amount}</li>)}
      </ul>
    </div>
  );
}
