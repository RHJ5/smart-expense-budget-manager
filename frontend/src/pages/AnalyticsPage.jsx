import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function AnalyticsPage() {
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const catResponse = await api.get('/categories');
        setCategories(catResponse.data.categories);

        const expenseResponse = await api.get('/analytics/expense-by-category');
        setCategoryData(expenseResponse.data.expenseByCategory);

        const trendResponse = await api.get('/analytics/monthly-trend');
        setTrendData(trendResponse.data.monthlyTrend);
      } catch (err) {
        setError('Analytics data load nahi ho saka');
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

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Analytics</h2>

      <h3>Expense by Category</h3>
      {pieData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>Is mahine koi expense data nahi hai</p>
      )}

      <h3>Monthly Trend (Income vs Expense)</h3>
      {trendData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#00C49F" />
            <Bar dataKey="expense" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>Trend data nahi hai</p>
      )}
    </div>
  );
}

export default AnalyticsPage;