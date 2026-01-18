export default function TransactionList({ transactions }) {
    if (transactions.length === 0) {
        return <p>No transactions yet.</p>;
    }
    return (
        <table border="1" cellPadding="4" style={{ width: '100%', marginBottom: 20 }}>
            <thead>
            <tr>
                <th>Type</th><th>Amount</th><th>Category</th><th>Description</th><th>Date</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map(t => (
                <tr key={t.id}>
                    <td>{t.type}</td>
                    <td>{Number(t.amount).toFixed(2)}</td>
                    <td>{t.category}</td>
                    <td>{t.description}</td>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
