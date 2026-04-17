import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { setToken } from '../lib/auth';
import { formatApiError } from '../lib/formatError';
import { Button, Card, ErrorText, Input, Label } from '../components/ui';

export function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ maxWidth: 520, margin: '40px auto' }}>
      <Card>
        <h2 style={{ margin: 0 }}>Create your account</h2>
        <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          Choose a username — it becomes your public scheduling link.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <div>
            <Label>Display name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jawad" />
          </div>
          <div>
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jawad" />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
        <div style={{ marginTop: 12 }}>
          <Label>Password (min 8)</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <Label>Timezone (IANA)</Label>
          <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Asia/Karachi" />
        </div>

        {error ? (
          <div style={{ marginTop: 12 }}>
            <ErrorText>{error}</ErrorText>
          </div>
        ) : null}

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <Link to="/login" style={{ color: '#334155', fontWeight: 700, textDecoration: 'none' }}>
            Already have an account?
          </Link>
          <Button
            disabled={loading}
            onClick={async () => {
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
            }}
          >
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

