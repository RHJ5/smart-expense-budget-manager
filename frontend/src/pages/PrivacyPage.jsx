import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

function PrivacyPage() {
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
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: September 2026</p>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text-primary mb-2">1. Information We Collect</h2>
            <p>
              When you create an account, we collect your name, email address, and a securely hashed version of your password.
              We never store your password in plain text.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-2">2. Financial Data</h2>
            <p>
              Any transaction, budget, or category data you enter is stored securely and is only accessible to you. We do not
              sell, share, or use your financial data for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-2">3. Data Security</h2>
            <p>
              We use industry-standard practices including password hashing (bcrypt) and token-based authentication (JWT) to
              protect your account. All data is transmitted over secure, encrypted connections.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-2">4. Your Rights</h2>
            <p>
              You can update your profile information at any time, and you may request deletion of your account and associated
              data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-2">5. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out via our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;