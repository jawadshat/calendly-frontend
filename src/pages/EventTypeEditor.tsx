/** Create/edit form for event type definitions used by public booking pages. */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';
import { Button, Card, ErrorText, Input, Label, Textarea } from '../components/ui';
import './AppChrome.css';
import './AppShared.css';

export function EventTypeEditor(props: { mode: 'new' | 'edit' }) {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id!;

  const [title, setTitle] = useState('Intro call');
  const [slug, setSlug] = useState('intro-call');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(props.mode === 'edit');

  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, [navigate]);

  const heading = useMemo(() => (props.mode === 'new' ? 'Create event type' : 'Edit event type'), [props.mode]);

  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);

        if (props.mode !== 'edit') return;

        const { items } = await api.listEventTypes();
        const found = items.find((x) => x._id === id);
        if (!found) {
          setError('Event type not found');
          return;
        }
        setTitle(found.title);
        setSlug(found.slug);
        setDurationMinutes(found.durationMinutes);
        setDescription(found.description ?? '');
        setIsActive(found.isActive ?? true);
      } catch (e: any) {
        setError(e?.error ?? 'Failed to load');
      } finally {
        setInitialLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, id]);

  if (initialLoading) return <div style={{ color: 'var(--muted)', fontWeight: 700 }}>Loading…</div>;

  return (
    <div className="editor-wrap">
      <div className="app-hero-card">
        <h1 className="app-hero-title">{heading}</h1>
        <p className="app-hero-subtitle">Create professional event links with clear titles, durations, and descriptions.</p>
      </div>

      <Card>
        <div className="app-section-title">{heading}</div>

        <div className="editor-grid" style={{ marginTop: 16 }}>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Slug (URL)</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
        </div>

        <div className="editor-grid" style={{ marginTop: 12 }}>
          <div>
            <Label>Duration (minutes)</Label>
            <Input
              value={String(durationMinutes)}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              type="number"
              min={5}
              max={480}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'end', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, color: 'var(--muted)' }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active
            </label>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional…" />
        </div>

        {error ? (
          <div style={{ marginTop: 12 }}>
            <ErrorText>{error}</ErrorText>
          </div>
        ) : null}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <Button
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                setError(null);
                const payload = { title, slug, durationMinutes, description, isActive, locationType: 'google_meet' };
                if (props.mode === 'new') {
                  await api.createEventType(payload);
                } else {
                  await api.updateEventType(id, payload);
                }
                navigate('/dashboard');
              } catch (e: any) {
                setError(e?.error ?? 'Save failed');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

