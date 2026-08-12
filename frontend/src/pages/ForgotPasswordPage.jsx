import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, ShoppingBag } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));

    setSent(true);
    setLoading(false);
    addToast('Password reset link sent! Check your email.', 'success');
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <div className="auth-logo">
              <ShoppingBag size={24} />
            </div>
            <h1 className="auth-title">
              {sent ? 'Check Your Email' : 'Reset Password'}
            </h1>
            <p className="auth-subtitle">
              {sent
                ? `We've sent a reset link to ${email}`
                : 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>

          {!sent ? (
            <form className="auth-form" onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                error={error}
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                icon={Send}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="auth-sent-actions">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => { setSent(false); setEmail(''); }}
              >
                Try a different email
              </Button>
            </div>
          )}

          <div className="auth-footer">
            <Link to="/login" className="auth-back-link">
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
