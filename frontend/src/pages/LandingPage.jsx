import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, PieChart, Target, ArrowRight, Mail } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-slate">
      <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center shadow-lg shadow-emerald/30">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-text-primary leading-tight">SmartExpense</h1>
            <p className="text-text-muted text-xs">Track - Plan - Achieve</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-text-secondary hover:text-emerald transition font-medium text-sm">
            Login
          </Link>
          <Link to="/register" className="bg-emerald text-white px-5 py-2.5 rounded-xl hover:bg-emerald/90 transition glow-btn font-medium text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 pt-16 pb-24 text-center">
        <h1 className="text-5xl font-extrabold text-text-primary tracking-tight mb-6">
          Take Control of Your <span className="text-emerald">Finances</span>
        </h1>
        <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
          Track income and expenses, set smart budgets, and get real-time insights into your spending habits, all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="bg-emerald text-white px-8 py-3.5 rounded-xl hover:bg-emerald/90 transition glow-btn font-semibold flex items-center gap-2">
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="bg-white text-text-primary px-8 py-3.5 rounded-xl border border-border-slate hover:border-emerald transition font-semibold">
            I Already Have an Account
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
            <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-emerald" />
            </div>
            <h3 className="font-bold text-text-primary mb-2">Track Everything</h3>
            <p className="text-text-secondary text-sm">Log income and expenses in seconds, categorized automatically for clarity.</p>
          </div>

          <div className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
            <div className="w-12 h-12 rounded-xl bg-blue-accent/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-accent" />
            </div>
            <h3 className="font-bold text-text-primary mb-2">Smart Budgets</h3>
            <p className="text-text-secondary text-sm">Set monthly, weekly, or custom budgets and get alerts before you overspend.</p>
          </div>

          <div className="bg-white rounded-2xl border border-border-slate p-6 card-hover">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-bold text-text-primary mb-2">Visual Insights</h3>
            <p className="text-text-secondary text-sm">Beautiful charts and smart insights help you understand where your money goes.</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-border-slate bg-white">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-text-primary text-sm">SmartExpense</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link to="/about" className="hover:text-emerald transition">About Us</Link>
            <Link to="/contact" className="hover:text-emerald transition">Contact Us</Link>
            <Link to="/privacy" className="hover:text-emerald transition">Privacy Policy</Link>
            <a href="mailto:uroosa1755@gmail.com" className="flex items-center gap-1.5 hover:text-emerald transition">
              <Mail className="w-4 h-4" />
              uroosa1755@gmail.com
            </a>
          </div>

          <p className="text-text-muted text-xs">2026 SmartExpense. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;