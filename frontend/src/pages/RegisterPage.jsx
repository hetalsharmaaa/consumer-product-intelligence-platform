import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { getCategories } from '../services/api';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  useEffect(() => { getCategories().then(setAllCategories).catch(() => setAllCategories([])); }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const updateField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePreference = (cat) => {
    setSelectedPreferences(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, selectedPreferences);
      addToast('Account created successfully! Welcome to InsightCart.', 'success');
      navigate('/');
    } catch (err) {
      setErrors({ submit: err.message });
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <div className="auth-logo">
              <ShoppingBag size={24} />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join InsightCart and shop smarter</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Your full name"
              value={form.name}
              onChange={updateField('name')}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              onChange={updateField('email')}
              error={errors.email}
              autoComplete="email"
            />

            <div className="input-group">
              <label className="input-label" htmlFor="register-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field input-with-icon ${errors.password ? 'input-has-error' : ''}`}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={updateField('password')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={updateField('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            {/* Preference Selection */}
            <div className="auth-preferences">
              <label className="input-label">Interests (optional)</label>
              <p className="auth-pref-hint">Select categories you're interested in for personalized recommendations</p>
              <div className="auth-pref-grid">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`auth-pref-tag ${selectedPreferences.includes(cat) ? 'auth-pref-tag-active' : ''}`}
                    onClick={() => togglePreference(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {errors.submit && (
              <div className="auth-error-banner">{errors.submit}</div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              icon={UserPlus}
            >
              Create Account
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
