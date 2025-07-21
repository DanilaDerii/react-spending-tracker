import React, { useState, useEffect } from 'react';
import {
  getCategories,
  saveCategory,
  getEntries,
  saveEntry
} from '../utils/storage';

export default function Journal() {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [newCat, setNewCat] = useState('');
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);

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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Journal</h1>

      {/* Entry Form */}
      <form onSubmit={addEntry} className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <label className="flex flex-col flex-1">
            <span className="mb-1 font-medium text-gray-700">Date</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="flex flex-col flex-1 mt-4 sm:mt-0">
            <span className="mb-1 font-medium text-gray-700">Category</span>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {categories.map(c => (
                <option key={c.spending_id} value={c.category}>
                  {c.category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col flex-1 mt-4 sm:mt-0">
            <span className="mb-1 font-medium text-gray-700">Amount</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="0.00"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Save Entry
        </button>
      </form>

      {/* Add Category Form */}
      <form onSubmit={addCategory} className="mb-8">
        <label className="flex flex-col mb-2">
          <span className="font-medium text-gray-700">New Category</span>
          <input
            type="text"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            required
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add new category"
          />
        </label>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Add Category
        </button>
      </form>

      {/* Recent Entries */}
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">Recent Entries</h2>
      {entries.length === 0 ? (
        <p className="text-gray-500">No entries yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {entries.map(en => (
            <li
              key={en.id}
              className="py-3 flex justify-between items-center text-gray-700"
            >
              <span>{en.date}</span>
              <span className="font-medium">{en.category}</span>
              <span className="text-green-600 font-semibold">${parseFloat(en.amount).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
