import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Home, Receipt, Wallet, BarChart3,User, Target, FileText, Settings, LogOut, PiggyBank } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Budgets', path: '/budgets', icon: Wallet },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/profile', icon: User },
];
function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-bg-slate">
      <aside className="w-64 bg-navy flex flex-col fixed h-screen">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">SmartExpense</h1>
              <p className="text-slate-400 text-xs">Track • Plan • Achieve</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? 'bg-emerald text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </nav>

        <div className="p-4">
          <div className="bg-white/5 rounded-2xl p-5">
            <PiggyBank className="w-8 h-8 text-emerald mb-3" />
            <h3 className="text-white font-semibold text-sm mb-2">
              Smart Money<br />Better Future
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plan your expenses, save more, achieve your goals.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;