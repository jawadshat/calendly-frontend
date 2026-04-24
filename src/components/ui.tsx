import type { ReactNode } from 'react';

export function Card(props: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={`cc-card${props.className ? ` ${props.className}` : ''}`}
      style={{
        padding: 16,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}

export function Label(props: { children: ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 900, color: '#334155', marginBottom: 6 }}>{props.children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="cc-input"
      style={{
        ...(props.style ?? {}),
      }}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="cc-input"
      style={{
        minHeight: 90,
        ...(props.style ?? {}),
      }}
    />
  );
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const variant = props.variant ?? 'primary';
  const className =
    'cc-btn ' + (variant === 'primary' ? 'cc-btn-primary' : 'cc-btn-secondary') + (props.className ? ` ${props.className}` : '');

  return (
    <button
      {...props}
      className={className}
      style={{
        ...(props.style ?? {}),
      }}
    />
  );
}

export function ErrorText(props: { children: ReactNode }) {
  return <div className="cc-error">{props.children}</div>;
}

