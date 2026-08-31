import { useState, useEffect } from 'react';
import api from '../services/api';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summaryResponse = await api.get('/dashboard/summary');
        setSummary(summaryResponse.data);

        const insightsResponse = await api.get('/insights');
        setInsights(insightsResponse.data.insights);
      } catch (err) {
        setError('Data load nahi ho saka');
      }
    };

    fetchDashboardData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', flex: 1 }}>
          <h4>Total Income</h4>
          <p>Rs. {summary.totalIncome}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', flex: 1 }}>
          <h4>Total Expenses</h4>
          <p>Rs. {summary.totalExpenses}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', flex: 1 }}>
          <h4>Balance</h4>
          <p>Rs. {summary.balance}</p>
        </div>
      </div>

      {insights.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Smart Insights</h3>
          <ul>
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3>Recent Transactions</h3>
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
            {summary.recentTransactions.map((t) => (
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
    </div>
  );
}

export default DashboardPage;