// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getEntries } from '../utils/storage';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Define a color palette for the Pie Chart
const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [totalAll, setTotalAll] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);

  // load entries once
  useEffect(() => {
    setEntries(getEntries());
  }, []);

  // recompute whenever entries or period change
  useEffect(() => {
    // parse amounts
    const data = entries.map(e => ({ ...e, amount: Number(e.amount) }));

    // total all time
    const sumAll = data.reduce((sum, e) => sum + e.amount, 0);
    setTotalAll(sumAll);

    // total this month
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const sumMonth = data
      .filter(e => e.date.startsWith(monthKey))
      .reduce((sum, e) => sum + e.amount, 0);
    setTotalMonth(sumMonth);

    // group for line chart
    const grouped = {};
    data.forEach(e => {
      let key;
      if (period === 'daily') {
        key = e.date; // YYYY-MM-DD
      } else if (period === 'weekly') {
        const d = new Date(e.date + 'T00:00:00'); // Add time to avoid timezone issues
        const day = d.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday of the current week
        const m = new Date(d.setDate(diff));
        key = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-${String(m.getDate()).padStart(2, '0')}`;
      } else { // monthly
        const [y, m] = e.date.split('-');
        key = `${y}-${m}`;
      }
      grouped[key] = (grouped[key] || 0) + e.amount;
    });

    const lineArr = Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, amount]) => ({ date, amount }));
    setLineData(lineArr);

    // group for pie chart (all-time by category)
    const catGroup = {};
    data.forEach(e => {
      catGroup[e.category] = (catGroup[e.category] || 0) + e.amount;
    });
    const pieArr = Object.entries(catGroup).map(([name, value]) => ({ name, value }));
    setPieData(pieArr);
  }, [entries, period]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">Dashboard</h1>

        {/* Totals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total All Time Spending</h2>
            <p className="text-4xl font-bold text-indigo-600">${totalAll.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total This Month Spending</h2>
            <p className="text-4xl font-bold text-purple-600">${totalMonth.toFixed(2)}</p>
          </div>
        </div>

        {/* Period Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 sm:mb-0 mr-4">Spending Trend Period:</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setPeriod('daily')}
              disabled={period === 'daily'}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                ${period === 'daily' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              disabled={period === 'weekly'}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                ${period === 'weekly' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              disabled={period === 'monthly'}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                ${period === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Spending Trend ({period})</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                    labelStyle={{ color: '#333' }}
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Category Breakdown (All Time)</h2>
            <div className="h-80 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    className="text-sm"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                    labelStyle={{ color: '#333' }}
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}