import { Link, useNavigate, Outlet } from 'react-router-dom';

function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ display: 'flex', gap: '15px', padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/budgets">Budgets</Link>
        <Link to="/analytics">Analytics</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;