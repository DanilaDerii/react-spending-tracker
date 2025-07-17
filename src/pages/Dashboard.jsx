// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getEntries } from '../utils/storage';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Legend
} from 'recharts';

export default function Dashboard() {
  const [entries, setEntries]     = useState([]);
  const [period, setPeriod]       = useState('monthly');
  const [lineData, setLineData]   = useState([]);
  const [pieData, setPieData]     = useState([]);
  const [totalAll, setTotalAll]   = useState(0);
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
        const d = new Date(e.date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
        const m = new Date(d.setDate(diff));
        key = `${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,'0')}-${String(m.getDate()).padStart(2,'0')}`;
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
    <div style={{ padding: '1rem' }}>
      <h1>Dashboard</h1>

      <p><strong>Total All Time:</strong> {totalAll}</p>
      <p><strong>Total This Month:</strong> {totalMonth}</p>

      <div>
        <button onClick={() => setPeriod('daily')} disabled={period === 'daily'}>Daily</button>
        <button onClick={() => setPeriod('weekly')} disabled={period === 'weekly'}>Weekly</button>
        <button onClick={() => setPeriod('monthly')} disabled={period === 'monthly'}>Monthly</button>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h2>Spending Trend ({period})</h2>
        <LineChart width={600} height={300} data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Category Breakdown</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          />
          <Legend />
        </PieChart>
      </section>
    </div>
  );
}
