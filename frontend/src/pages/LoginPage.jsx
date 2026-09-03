import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import api from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-border-slate rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 hover:border-emerald transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-slate">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-border-slate w-full max-w-md card-hover">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center shadow-lg shadow-emerald/30">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h1 className="font-bold text-text-primary leading-tight">SmartExpense</h1>
            <p className="text-text-muted text-xs">Track • Plan • Achieve</p>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-text-primary mb-6 text-center tracking-tight">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
          </div>
          {error && <p className="text-expense text-sm bg-expense/10 px-3 py-2 rounded-xl">{error}</p>}
          <button type="submit" className="w-full bg-emerald text-white py-2.5 rounded-xl hover:bg-emerald/90 transition glow-btn cursor-pointer font-medium">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;