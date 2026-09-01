import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import api from '../services/api';

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
const [newCategoryName, setNewCategoryName] = useState('');
const [newCategoryType, setNewCategoryType] = useState('expense');

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data.budgets);
    } catch (err) {
      setError('Failed to load budgets');
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
      setError('Failed to add budget');
    }
  };
  const handleCategorySelect = (e) => {
  if (e.target.value === 'NEW') {
    setShowNewCategory(true);
    setCategoryId('');
  } else {
    setShowNewCategory(false);
    setCategoryId(e.target.value);
  }
};

const handleCreateCategory = async () => {
  if (!newCategoryName.trim()) return;
  try {
    const response = await api.post('/categories', { name: newCategoryName, type: newCategoryType });
    await fetchCategories();
    setCategoryId(response.data.category.id);
    setShowNewCategory(false);
    setNewCategoryName('');
  } catch (err) {
    setError('Failed to create category');
  }
};

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : `Category ${id}`;
  };

  const statusStyles = {
    'exceeded': { bar: 'bg-expense', badge: 'bg-expense/10 text-expense' },
    'near limit': { bar: 'bg-warning', badge: 'bg-warning/10 text-warning' },
    'under budget': { bar: 'bg-emerald', badge: 'bg-emerald/10 text-emerald' },
  };

  const inputClass = "px-3 py-2.5 border border-border-slate rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 hover:border-emerald transition";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Budgets</h1>
        <p className="text-text-secondary text-sm mt-1">Set spending limits and track your progress.</p>
      </div>

      {error && <p className="text-expense text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-2xl border border-border-slate p-6 mb-6 card-hover">
        <h3 className="font-semibold text-text-primary mb-4">Create Budget</h3>
        <form onSubmit={handleAddBudget} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select value={categoryId} onChange={handleCategorySelect} required className={inputClass + " bg-white cursor-pointer"}>
  <option value="">Category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
  <option value="NEW">+ Add New Category</option>
</select>
            {showNewCategory && (
  <div className="md:col-span-4 flex gap-3 bg-bg-slate p-4 rounded-xl">
    <input
      type="text"
      placeholder="New category name"
      value={newCategoryName}
      onChange={(e) => setNewCategoryName(e.target.value)}
      className={inputClass + " flex-1"}
    />
    <select
      value={newCategoryType}
      onChange={(e) => setNewCategoryType(e.target.value)}
      className={inputClass + " bg-white cursor-pointer"}
    >
      <option value="expense">Expense</option>
      <option value="income">Income</option>
    </select>
    <button
      type="button"
      onClick={handleCreateCategory}
      className="bg-blue-accent text-white text-sm font-medium px-4 rounded-xl hover:bg-blue-accent/90 transition cursor-pointer"
    >
      Create
    </button>
  </div>
)}
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className={inputClass} />
          <input type="text" placeholder="Period (e.g. 2026-08)" value={period} onChange={(e) => setPeriod(e.target.value)} required className={inputClass} />
          <button type="submit" className="bg-emerald text-white text-sm font-medium py-2.5 rounded-xl hover:bg-emerald/90 transition glow-btn cursor-pointer">
            Add Budget
          </button>
        </form>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-slate p-6 text-center text-text-muted text-sm card-hover">
          No budgets created yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const style = statusStyles[b.status] || statusStyles['under budget'];
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-emerald" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{getCategoryName(b.categoryId)}</h4>
                      <p className="text-xs text-text-muted">{b.period}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${style.badge}`}>
                    {b.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold text-text-primary">Rs. {b.spent}</span>
                  <span className="text-sm text-text-muted">of Rs. {b.amount}</span>
                </div>

                <div className="w-full bg-bg-slate rounded-full h-2 mb-3">
                  <div
                    className={`${style.bar} h-2 rounded-full transition-all`}
                    style={{ width: `${Math.min(b.percentageUsed, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-text-secondary">
                  <span>{b.percentageUsed}% used</span>
                  <span>Rs. {b.remaining} remaining</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;