import { useState, useEffect } from 'react';
import api from '../services/api';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.transactions);
    } catch (err) {
      setError('Transactions load nahi ho sake');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Categories load nahi ho sakin');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', { categoryId, type, amount, description, date });
      setCategoryId('');
      setAmount('');
      setDescription('');
      setDate('');
      fetchTransactions();
    } catch (err) {
      setError('Transaction add nahi ho saka');
    }
  };

  return (
    <div>
      <h2>Transactions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAddTransaction}>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Category chunein</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.type})
            </option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit">Add Transaction</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsPage;