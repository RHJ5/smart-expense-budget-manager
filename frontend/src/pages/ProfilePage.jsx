import { useState, useEffect } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import api from '../services/api';

function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setPreferredCurrency(response.data.user.preferredCurrency);
        setCreatedAt(response.data.user.createdAt);
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put('/users/profile', { name, preferredCurrency });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const inputClass = "px-3 py-2.5 border border-border-slate rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 hover:border-emerald transition w-full";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Profile</h1>
        <p className="text-text-secondary text-sm mt-1 font-medium">Manage your account information.</p>
      </div>

      <div className="max-w-xl bg-white rounded-2xl border border-border-slate p-6 card-hover">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-slate">
          <div className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center">
            <User className="w-8 h-8 text-emerald" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-lg">{name}</h3>
            <p className="text-text-secondary text-sm flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {email}
            </p>
            {createdAt && (
              <p className="text-text-muted text-xs flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5" /> Joined {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-expense text-sm mb-4">{error}</p>}
        {success && <p className="text-emerald text-sm mb-4">{success}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Preferred Currency</label>
            <select value={preferredCurrency} onChange={(e) => setPreferredCurrency(e.target.value)} className={inputClass + " bg-white cursor-pointer appearance-none"}>
              <option value="PKR">PKR - Pakistani Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <button type="submit" className="bg-emerald text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-emerald/90 transition glow-btn cursor-pointer">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;