import { useState, useEffect } from 'react';
import { Wallet, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [periodType, setPeriodType] = useState('monthly');
  const [monthValue, setMonthValue] = useState('');
  const [weekValue, setWeekValue] = useState('');
  const [yearValue, setYearValue] = useState('');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

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

  const resetForm = () => {
    setEditingId(null);
    setCategoryId('');
    setAmount('');
    setPeriodType('monthly');
    setMonthValue('');
    setWeekValue('');
    setYearValue('');
    setCustomStart('');
    setCustomEnd('');
  };

  const calculateDateRange = () => {
    if (periodType === 'monthly' && monthValue) {
      const [year, month] = monthValue.split('-');
      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
      return { startDate, endDate };
    }

    if (periodType === 'weekly' && weekValue) {
      const selected = new Date(weekValue);
      const day = selected.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(selected);
      monday.setDate(selected.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const format = (d) => d.toISOString().slice(0, 10);
      return { startDate: format(monday), endDate: format(sunday) };
    }

    if (periodType === 'yearly' && yearValue) {
      return { startDate: `${yearValue}-01-01`, endDate: `${yearValue}-12-31` };
    }

    if (periodType === 'custom' && customStart && customEnd) {
      return { startDate: customStart, endDate: customEnd };
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const range = calculateDateRange();
    if (!range) {
      setError('Please select a valid period');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/budgets/${editingId}`, { categoryId, amount, ...range });
      } else {
        await api.post('/budgets', { categoryId, amount, ...range });
      }
      resetForm();
      fetchBudgets();
    } catch (err) {
      setError(editingId ? 'Failed to update budget' : 'Failed to add budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget.id);
    setCategoryId(budget.categoryId);
    setAmount(budget.amount);
    setPeriodType('custom');
    setCustomStart(budget.startDate);
    setCustomEnd(budget.endDate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      setError('Failed to delete budget');
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

  const getColorForPercent = (percent) => {
    if (percent >= 80) return { bar: 'bg-expense', badge: 'bg-expense/10 text-expense', label: 'Exceeded' };
    if (percent >= 50) return { bar: 'bg-warning', badge: 'bg-warning/10 text-warning', label: 'Near Limit' };
    return { bar: 'bg-emerald', badge: 'bg-emerald/10 text-emerald', label: 'On Track' };
  };

  const inputClass = "px-3 py-2.5 border border-border-slate rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 hover:border-emerald transition";

  const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + parseFloat(b.spent), 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Budgets</h1>
        <p className="text-text-secondary text-sm mt-1">Set spending limits and track your progress.</p>
      </div>

      {error && <p className="text-expense text-sm mb-4">{error}</p>}

      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-border-slate p-5 card-hover">
            <p className="text-text-secondary text-sm mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-text-primary">Rs. {totalBudget}</p>
          </div>
          <div className="bg-white rounded-2xl border border-border-slate p-5 card-hover">
            <p className="text-text-secondary text-sm mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-expense">Rs. {totalSpent}</p>
          </div>
          <div className="bg-white rounded-2xl border border-border-slate p-5 card-hover">
            <p className="text-text-secondary text-sm mb-1">Total Remaining</p>
            <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-emerald' : 'text-expense'}`}>
              Rs. {totalRemaining}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border-slate p-6 mb-6 card-hover">
        <h3 className="font-semibold text-text-primary mb-4">{editingId ? 'Edit Budget' : 'Create Budget'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={categoryId} onChange={handleCategorySelect} required className={inputClass + " bg-white cursor-pointer"}>
              <option value="">Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="NEW">+ Add New Category</option>
            </select>

            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className={inputClass} />

            <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} className={inputClass + " bg-white cursor-pointer"}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {showNewCategory && (
            <div className="flex gap-3 bg-bg-slate p-4 rounded-xl">
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

          {periodType === 'monthly' && (
            <input type="month" value={monthValue} onChange={(e) => setMonthValue(e.target.value)} required className={inputClass + " cursor-pointer"} />
          )}
          {periodType === 'weekly' && (
            <input type="date" value={weekValue} onChange={(e) => setWeekValue(e.target.value)} required className={inputClass + " cursor-pointer"} />
          )}
          {periodType === 'yearly' && (
            <input type="number" placeholder="Year (e.g. 2026)" value={yearValue} onChange={(e) => setYearValue(e.target.value)} required className={inputClass} />
          )}
          {periodType === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} required className={inputClass + " cursor-pointer"} />
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} required className={inputClass + " cursor-pointer"} />
            </div>
          )}

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-emerald text-white text-sm font-medium py-2.5 rounded-xl hover:bg-emerald/90 transition glow-btn cursor-pointer">
              {editingId ? 'Update' : 'Add Budget'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 border border-border-slate rounded-xl text-sm text-text-secondary hover:bg-bg-slate transition cursor-pointer">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-slate p-6 text-center text-text-muted text-sm card-hover">
          No budgets created yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const style = getColorForPercent(b.percentageUsed);
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-emerald" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{getCategoryName(b.categoryId)}</h4>
                      <p className="text-xs text-text-muted">{b.startDate} → {b.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style.badge}`}>
                      {style.label}
                    </span>
                    <button onClick={() => handleEdit(b)} className="text-text-muted hover:text-blue-accent transition cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="text-text-muted hover:text-expense transition cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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