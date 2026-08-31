import { useState, useEffect } from 'react';
import api from '../services/api';

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('');

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data.budgets);
    } catch (err) {
      setError('Budgets load nahi ho sake');
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
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { categoryId, amount, period });
      setCategoryId('');
      setAmount('');
      setPeriod('');
      fetchBudgets();
    } catch (err) {
      setError('Budget add nahi ho saka');
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : id;
  };

  return (
    <div>
      <h2>Budgets</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAddBudget}>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Category chunein</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
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
          placeholder="Period (jaise 2026-08)"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          required
        />
        <button type="submit">Add Budget</button>
      </form>

      <div>
        {budgets.map((b) => (
          <div key={b.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h4>{getCategoryName(b.categoryId)} — {b.period}</h4>
            <p>Budget: Rs. {b.amount} | Spent: Rs. {b.spent} | Remaining: Rs. {b.remaining}</p>
            <div style={{ background: '#eee', width: '100%', height: '20px' }}>
              <div
                style={{
                  background: b.status === 'exceeded' ? 'red' : b.status === 'near limit' ? 'orange' : 'green',
                  width: `${Math.min(b.percentageUsed, 100)}%`,
                  height: '100%',
                }}
              ></div>
            </div>
            <p>{b.percentageUsed}% used — {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetsPage;