import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { setToken } from '../lib/auth';
import { formatApiError } from '../lib/formatError';
import { Button, Card, ErrorText, Input, Label } from '../components/ui';
import './AppChrome.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <h2>Welcome back</h2>
        <p>Log in to manage your calendar links and bookings.</p>
      </div>
      <Card>
        <h2 style={{ margin: 0 }}>Log in</h2>
        <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Access your scheduling dashboard.</div>

        <div style={{ marginTop: 16 }}>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
        <div style={{ marginTop: 12 }}>
          <Label>Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
          />
        </div>

        {error ? (
          <div style={{ marginTop: 12 }}>
            <ErrorText>{error}</ErrorText>
          </div>
        ) : null}

        <div className="auth-footer">
          <Link to="/register" className="auth-link">
            Create account
          </Link>
          <Button
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                setError(null);
                const { token } = await api.login({ email, password });
                setToken(token);
                navigate('/dashboard');
              } catch (e: any) {
                setError(formatApiError(e));
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

