import { useState } from 'react';

/**
 * @typedef TransactionFormProps
 * @property {(txn: { type: string; amount: string; category: string; description: string; currency: string }) => void} onAdd
 * @property {string[]} currencies
 */

/**
 * @param {TransactionFormProps} props
 */
export default function TransactionForm({ onAdd, currencies }) {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState(currencies[0] || 'USD');

    const handleSubmit = e => {
        e.preventDefault();
        onAdd({ type, amount, category, description, currency });
        // reset
        setAmount('');
        setCategory('');
        setDescription('');
        setCurrency(currencies[0] || 'USD');
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select value={type} onChange={e => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(String(e.target.value))}
                required
            />

            <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
            >
                {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            <button type="submit">Add</button>
        </form>
    );
}
