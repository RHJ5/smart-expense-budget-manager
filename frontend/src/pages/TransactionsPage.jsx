import { useState, useEffect } from 'react';
import { Trash2, Receipt } from 'lucide-react';
import api from '../services/api';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
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
      setError('Failed to load transactions');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const fetchBudgetsList = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data.budgets);
    } catch (err) {
      console.error('Failed to load budgets');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchBudgetsList();
  }, []);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : 'Other';
  };

  const getCategoryNameForForm = (id) => {
    const cat = categories.find((c) => c.id === parseInt(id));
    return cat ? cat.name : 'this category';
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', { categoryId, type, amount, description, date });

      if (type === 'expense') {
        const hasBudget = budgets.some((b) => b.categoryId === parseInt(categoryId));
        if (!hasBudget) {
          setError(`Note: "${getCategoryNameForForm(categoryId)}" has no budget set for tracking.`);
        } else {
          setError('');
        }
      } else {
        setError('');
      }

      setCategoryId('');
      setAmount('');
      setDescription('');
      setDate('');
      fetchTransactions();
      fetchBudgetsList();
    } catch (err) {
      setError('Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  const selectClass = "px-3 py-2.5 border border-border-slate rounded-xl text-sm text-text-primary bg-white cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-emerald/40 hover:border-emerald transition";
  const inputClass = "px-3 py-2.5 border border-border-slate rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 hover:border-emerald transition";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Transactions</h1>
        <p className="text-text-secondary text-sm mt-1 font-medium">Manage all your income and expenses here.</p>
      </div>

      {error && <p className="text-warning text-sm mb-4 bg-warning/10 px-4 py-2 rounded-xl">{error}</p>}

      <div className="bg-white rounded-2xl border border-border-slate p-6 mb-6 card-hover">
        <h3 className="font-bold text-text-primary mb-4">Add Transaction</h3>
        <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={selectClass + " w-full"}>
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass + " w-full"}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className={inputClass} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass + " cursor-pointer"} />

          <button type="submit" className="md:col-span-5 bg-emerald text-white text-sm font-medium py-2.5 rounded-xl hover:bg-emerald/90 transition glow-btn cursor-pointer">
            Add Transaction
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
        <h3 className="font-semibold text-text-primary mb-4">All Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-text-secondary text-sm mt-1 font-medium">No Transaction Found</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-text-muted border-b border-border-slate">
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border-slate last:border-0 hover:bg-bg-slate transition">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-4 h-4 text-emerald" />
                      </div>
                      <span className="text-sm text-text-primary">{t.description || '—'}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-xs font-medium bg-blue-accent/10 text-blue-accent px-2.5 py-1 rounded-full">
                      {getCategoryName(t.categoryId)}
                    </span>
                  </td>
                  <td className={`py-3 text-sm font-semibold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {t.type === 'income' ? '+' : '-'}Rs. {t.amount}
                  </td>
                  <td className="py-3 text-sm text-text-secondary">{t.date}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => handleDelete(t.id)} className="text-text-muted hover:text-expense transition cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TransactionsPage;