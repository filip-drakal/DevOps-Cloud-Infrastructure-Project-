import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import FilterControls from './components/FilterControls.jsx';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

export default function App() {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({ search: '', startDate: null, endDate: null });

    // Exchange rates state
    const [rates, setRates] = useState({});
    const [baseCurrency, setBaseCurrency] = useState('USD');

    // Guard against undefined rates
    const safeRates = rates || {};

    // Combine base currency with fetched rates keys
    const currencies = useMemo(() => {
        return Array.from(new Set([baseCurrency, ...Object.keys(safeRates)]));
    }, [baseCurrency, safeRates]);

    // Load transactions once
    useEffect(() => {
        axios.get('/api/transactions')
            .then(r => setTransactions(r.data))
            .catch(console.error);
    }, []);

    // Fetch exchange rates when baseCurrency changes
    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(
                    `https://api.exchangerate.host/latest?base=${baseCurrency}`
                );
                setRates(response.data.rates);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [baseCurrency]);

    const handleAdd = txn =>
        axios.post('/api/transactions', txn)
            .then(() => axios.get('/api/transactions').then(r => setTransactions(r.data)))
            .catch(console.error);

    const filtered = useMemo(() =>
            transactions.filter(t => {
                const d = new Date(t.date);
                if (filters.startDate && d < filters.startDate) return false;
                if (filters.endDate && d > filters.endDate) return false;
                const term = filters.search.toLowerCase();
                return (
                    t.category.toLowerCase().includes(term) ||
                    (t.description || '').toLowerCase().includes(term)
                );
            }),
        [transactions, filters]
    );

    // Sum by category with currency conversion
    const totals = filtered.reduce((acc, t) => {
        const rate = safeRates[t.currency] ?? 1;
        const amt = parseFloat(t.amount) * rate;
        acc[t.category] = (acc[t.category] || 0) + amt;
        return acc;
    }, {});

    const categories = Object.keys(totals);
    const values = categories.map(cat => totals[cat]);

    const defaultColors = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#C9CBCF','#4D5360'];
    const backgroundColor = categories.map((_, i) => defaultColors[i % defaultColors.length]);
    const borderColor = categories.map(() => '#fff');

    return (
        <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
            <h1>MyBudget</h1>

            <FilterControls
                filters={filters}
                onChange={setFilters}
                currencies={currencies}
                baseCurrency={baseCurrency}
                onBaseCurrencyChange={setBaseCurrency}
            />

            <TransactionForm onAdd={handleAdd} currencies={currencies} />
            <TransactionList transactions={filtered} />

            {filtered.length > 0 && (
                <>
                    <h2>By Category ({baseCurrency})</h2>
                    <Pie
                        data={{ labels: categories, datasets: [{ data: values, backgroundColor, borderColor, borderWidth: 2 }] }}
                    />
                </>
            )}
        </div>
    );
}