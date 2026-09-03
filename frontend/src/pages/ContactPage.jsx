import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Mail } from 'lucide-react';

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass = "w-full px-3 py-2.5 border border-border-slate rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 hover:border-emerald transition";

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

      <div className="max-w-xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight mb-3">Contact Us</h1>
        <p className="text-text-secondary mb-8">Have a question or feedback? We'd love to hear from you.</p>

        {sent ? (
          <div className="bg-emerald/10 border border-emerald/20 rounded-2xl p-6 text-center">
            <Mail className="w-10 h-10 text-emerald mx-auto mb-3" />
            <p className="text-text-primary font-semibold">Thanks for reaching out!</p>
            <p className="text-text-secondary text-sm mt-1">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border-slate p-6 space-y-4 card-hover">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows="4" className={inputClass}></textarea>
            </div>
            <button type="submit" className="bg-emerald text-white px-6 py-2.5 rounded-xl hover:bg-emerald/90 transition glow-btn font-medium cursor-pointer">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactPage;