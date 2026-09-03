import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-slate">
      <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center shadow-lg shadow-emerald/30">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-text-primary leading-tight">SmartExpense</h1>
            <p className="text-text-muted text-xs">Track • Plan • Achieve</p>
          </div>
        </Link>
        <Link to="/login" className="text-text-secondary hover:text-emerald transition font-medium text-sm">
          Login
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight mb-6">About SmartExpense</h1>
        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            SmartExpense was built with a simple mission: help people understand and control their money without the complexity
            of traditional finance tools.
          </p>
          <p>
            We believe managing your finances shouldn't require a finance degree. That's why SmartExpense focuses on clarity —
            simple tracking, visual insights, and smart budgets that actually make sense.
          </p>
          <p>
            Whether you're saving for a goal, trying to understand where your money goes each month, or just starting to take
            your finances seriously, SmartExpense is designed to be the tool that grows with you.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;