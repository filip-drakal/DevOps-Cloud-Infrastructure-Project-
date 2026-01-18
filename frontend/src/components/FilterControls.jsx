import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function FilterControls({
                                           filters,
                                           onChange,
                                           currencies,
                                           baseCurrency,
                                           onBaseCurrencyChange
                                       }) {
    return (
        <div style={{
            display: 'flex', gap: '1rem',
            marginBottom: '1.5rem', flexWrap: 'wrap'
        }}>
            <input
                type="text"
                placeholder="Search…"
                value={filters.search}
                onChange={e => onChange({ ...filters, search: e.target.value })}
            />
            <DatePicker
                selected={filters.startDate}
                onChange={d => onChange({ ...filters, startDate: d })}
                placeholderText="From"
             showMonthYearDropdown/>
            <DatePicker
                selected={filters.endDate}
                onChange={d => onChange({ ...filters, endDate: d })}
                placeholderText="To"
             showMonthYearDropdown/>
            <select
                value={baseCurrency}
                onChange={e => onBaseCurrencyChange(e.target.value)}
            >
                {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
        </div>
    );
}
