import { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Target, Calendar, Lightbulb, ArrowRight, UtensilsCrossed, Car, ShoppingBag, Receipt as ReceiptIcon, MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const categoryIcons = {
  'Food': UtensilsCrossed,
  'Transport': Car,
  'Shopping': ShoppingBag,
  'Bills': ReceiptIcon,
};

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState([]);
  const [incomeByCategory, setIncomeByCategory] = useState([]);
  const [error, setError] = useState('');
useEffect(() => {
  const fetchAll = async () => {
    try {
      const [summaryRes, insightsRes, catRes, expenseCatRes, incomeCatRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/insights'),
        api.get('/categories'),
        api.get('/analytics/expense-by-category'),
        api.get('/analytics/income-by-category'),
      ]);
      setSummary(summaryRes.data);
      setInsights(insightsRes.data.insights);
      setCategories(catRes.data.categories);
      setExpenseByCategory(expenseCatRes.data.expenseByCategory);
      setIncomeByCategory(incomeCatRes.data.incomeByCategory);
    } catch (err) {
      setError('Data load nahi ho saka');
    }
  };
  fetchAll();
}, []);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : 'Other';
  };

  if (error) return <p className="text-expense">{error}</p>;
  if (!summary) return <p className="text-text-muted">Loading...</p>;

  const budgetPercent = summary.totalIncome > 0
    ? Math.min(Math.round((summary.totalExpenses / summary.totalIncome) * 100), 100)
    : 0;

  const totalSpend = expenseByCategory.reduce((sum, c) => sum + parseFloat(c.total), 0);
  const spendingCategories = expenseByCategory
    .map((c) => ({
      name: getCategoryName(c.categoryId),
      amount: parseFloat(c.total),
      percent: totalSpend > 0 ? Math.round((parseFloat(c.total) / totalSpend) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
const totalIncome = incomeByCategory.reduce((sum, c) => sum + parseFloat(c.total), 0);
const incomeBreakdown = incomeByCategory
  .map((c) => ({
    name: getCategoryName(c.categoryId),
    amount: parseFloat(c.total),
    percent: totalIncome > 0 ? Math.round((parseFloat(c.total) / totalIncome) * 100) : 0,
  }))
  .sort((a, b) => b.amount - a.amount);
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Welcome Back</h1>
          <p className="text-text-secondary text-sm mt-1">Here's your financial overview for this month.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border-slate rounded-xl px-4 py-2.5 text-sm text-text-secondary">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard icon={Wallet} iconBg="bg-emerald/10" iconColor="text-emerald" title="Total Balance" value={`Rs. ${summary.balance}`} />
        <SummaryCard icon={ArrowDownCircle} iconBg="bg-emerald/10" iconColor="text-emerald" title="Income" value={`Rs. ${summary.totalIncome}`} />
        <SummaryCard icon={ArrowUpCircle} iconBg="bg-expense/10" iconColor="text-expense" title="Expenses" value={`Rs. ${summary.totalExpenses}`} />
        <SummaryCard icon={Target} iconBg="bg-blue-accent/10" iconColor="text-blue-accent" title="Budget Used" value={`${budgetPercent}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-slate p-6 card-hover">
          <h3 className="font-semibold text-text-primary mb-6">Expense by Category</h3>
          {spendingCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={spendingCategories}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-muted text-sm">Is mahine koi expense nahi hai</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border-slate p-6 flex flex-col items-center card-hover">
          <h3 className="font-semibold text-text-primary self-start mb-4">Budget Overview</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={[{ value: budgetPercent }, { value: 100 - budgetPercent }]}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#10B981" />
                <Cell fill="#E2E8F0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-24 mb-16">
            <p className="text-2xl font-bold text-text-primary">{budgetPercent}%</p>
            <p className="text-xs text-text-muted">Budget Used</p>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Rs. {summary.totalExpenses} / Rs. {summary.totalIncome}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-slate p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Recent Transactions</h3>
            <span className="text-emerald text-sm font-medium cursor-pointer">View All</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-text-muted border-b border-border-slate">
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentTransactions.map((t) => (
                <tr key={t.id} className="border-b border-border-slate last:border-0 hover:bg-bg-slate transition">
                  <td className="py-3 text-sm text-text-primary">{t.description || getCategoryName(t.categoryId)}</td>
                  <td className={`py-3 text-sm font-semibold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {t.type === 'income' ? '+' : '-'}Rs. {t.amount}
                  </td>
                  <td className="py-3 text-sm text-text-secondary">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
            <h3 className="font-semibold text-text-primary mb-4">Top Spending Categories</h3>
            <div className="space-y-4">
              {spendingCategories.slice(0, 4).map((cat) => {
                const Icon = categoryIcons[cat.name] || MoreHorizontal;
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-emerald" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-primary font-medium truncate">{cat.name}</span>
                        <span className="text-text-secondary">Rs. {cat.amount}</span>
                      </div>
                      <div className="w-full bg-bg-slate rounded-full h-1.5">
                        <div className="bg-emerald h-1.5 rounded-full" style={{ width: `${cat.percent}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
{incomeBreakdown.length > 0 && (
  <div className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
    <h3 className="font-bold text-text-primary mb-4">Income Breakdown</h3>
    <div className="space-y-4">
      {incomeBreakdown.map((inc) => (
        <div key={inc.name} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
            <span className="text-emerald text-xs font-bold">{inc.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-primary font-medium truncate">{inc.name}</span>
              <span className="text-income font-semibold">Rs. {inc.amount}</span>
            </div>
            <div className="w-full bg-bg-slate rounded-full h-1.5">
              <div className="bg-emerald h-1.5 rounded-full" style={{ width: `${inc.percent}%` }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
          <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-6 card-hover">
            <Lightbulb className="w-8 h-8 text-emerald mb-3" />
            <h3 className="font-semibold text-text-primary mb-2">Stay on Track</h3>
            <p className="text-sm text-text-secondary mb-4">
              {insights.length > 0 ? insights[0] : 'Small savings today create a big difference tomorrow.'}
            </p>
            <button className="flex items-center gap-2 bg-emerald text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-emerald/90 transition glow-btn">
              View Insights <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, iconBg, iconColor, title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-border-slate p-5 card-hover">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-text-secondary text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

export default DashboardPage;