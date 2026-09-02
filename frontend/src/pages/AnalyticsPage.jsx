import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import api from '../services/api';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#DC2626', '#8B5CF6', '#EC4899'];

function AnalyticsPage() {
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [catRes, expenseRes, trendRes] = await Promise.all([
          api.get('/categories'),
          api.get('/analytics/expense-by-category'),
          api.get('/analytics/monthly-trend'),
        ]);
        setCategories(catRes.data.categories);
        setCategoryData(expenseRes.data.expenseByCategory);
        setTrendData(trendRes.data.monthlyTrend);
      } catch (err) {
        setError('Failed to load analytics data');
      }
    };
    fetchAnalytics();
  }, []);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : `Category ${id}`;
  };

  const pieData = categoryData.map((item) => ({
    name: getCategoryName(item.categoryId),
    value: parseFloat(item.total),
  }));

  if (error) return <p className="text-expense">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Analytics</h1>
        <p className="text-text-secondary text-sm mt-1 font-medium">Visual breakdown of your spending patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald/10 flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 text-emerald" />
            </div>
            <h3 className="font-bold text-text-primary">Expense by Category</h3>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-muted text-sm text-center py-12">No expense data for this month</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-accent/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-accent" />
            </div>
            <h3 className="font-bold text-text-primary">Monthly Trend</h3>
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }} />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#DC2626" radius={[6, 6, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-muted text-sm text-center py-12">No trend data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;