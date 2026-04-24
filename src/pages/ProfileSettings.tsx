import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, ErrorText } from '../components/ui';
import { getToken } from '../lib/auth';
import { api } from '../lib/api';
import './AppPages.css';

export function ProfileSettings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ username?: string; email?: string; displayName?: string; timezone?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError(null);
        const me = await api.me();
        setProfile({
          username: me?.user?.username ?? '',
          email: me?.user?.email ?? '',
          displayName: me?.user?.displayName ?? '',
          timezone: me?.availability?.timezone ?? 'UTC',
        });
      } catch (e: any) {
        setError(e?.error ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="cc-muted" style={{ fontWeight: 800 }}>Loading profile…</div>;
  if (error) return <ErrorText>{error}</ErrorText>;

  const displayName = profile?.displayName || profile?.username || 'Account';

  return (
    <div className="app-shell">
      <div className="app-hero-card">
        <h1 className="app-hero-title">Profile Settings</h1>
        <p className="app-hero-subtitle">Manage your account details and workspace identity.</p>
      </div>

      <Card className="profile-settings-card">
        <div className="profile-settings-head">
          <div className="profile-settings-avatar">{(displayName[0] ?? 'U').toUpperCase()}</div>
          <div>
            <h2 className="app-section-title">{displayName}</h2>
            <p className="app-section-subtitle">@{profile?.username || 'user'}</p>
          </div>
        </div>

        <div className="profile-settings-grid">
          <div className="profile-settings-item">
            <span>Display name</span>
            <strong>{profile?.displayName || '-'}</strong>
          </div>
          <div className="profile-settings-item">
            <span>Username</span>
            <strong>{profile?.username || '-'}</strong>
          </div>
          <div className="profile-settings-item">
            <span>Email</span>
            <strong>{profile?.email || '-'}</strong>
          </div>
          <div className="profile-settings-item">
            <span>Timezone</span>
            <strong>{profile?.timezone || 'UTC'}</strong>
          </div>
        </div>
      </Card>
    </div>
  );
}
