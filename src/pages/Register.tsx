import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { setToken } from '../lib/auth';
import { formatApiError } from '../lib/formatError';
import { Button, Card, ErrorText, Input, Label } from '../components/ui';
import './AppChrome.css';

export function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      setError(null);
      const { token } = await api.register({ email, password, username, displayName, timezone });
      setToken(token);
      navigate('/dashboard');
    } catch (e: any) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <h2>Create your account</h2>
        <p>Start sharing your beautiful scheduling page in minutes.</p>
      </div>
      <Card>
        <h2 style={{ margin: 0 }}>Create your account</h2>
        <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          Choose a username — it becomes your public scheduling link.
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await submit();
          }}
        >
          <div className="auth-grid-2" style={{ marginTop: 16 }}>
            <div>
              <Label htmlFor="register-display-name">Display name</Label>
              <Input id="register-display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jawad" />
            </div>
            <div>
              <Label htmlFor="register-username">Username</Label>
              <Input id="register-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jawad" />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <Label htmlFor="register-email">Email</Label>
            <Input id="register-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div style={{ marginTop: 12 }}>
            <Label htmlFor="register-password">Password (min 8)</Label>
            <Input
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <Label htmlFor="register-timezone">Timezone (IANA)</Label>
            <Input id="register-timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Asia/Karachi" />
          </div>

        {error ? (
          <div style={{ marginTop: 12 }}>
            <ErrorText>{error}</ErrorText>
          </div>
        ) : null}

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              Already have an account?
            </Link>
            <Button disabled={loading} type="submit">
              {loading ? 'Creating…' : 'Create account'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

