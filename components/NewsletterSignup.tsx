'use client';

import { useState } from 'react';

export default function NewsletterSignup({
  heading,
  body,
  placeholder,
  successMessage
}: {
  heading: string;
  body: string;
  placeholder: string;
  successMessage: string;
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email')?.toString() })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg('Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <div className="reveal">
      <p className="text-[9px] tracking-[0.24em] uppercase text-charcoal/60 font-light mb-1.5">{heading}</p>
      <p className="text-[9px] leading-[1.6] text-charcoal/45 font-light max-w-xs mb-3">{body}</p>
      {status === 'success' ? (
        <p className="text-[9px] text-gold font-light">{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-xs">
          <input
            name="email"
            type="email"
            required
            placeholder={placeholder}
            className="flex-1 bg-transparent border-b border-charcoal/25 focus:border-charcoal outline-none py-1.5 text-[9px] text-charcoal placeholder:text-charcoal/35 font-light transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            aria-label="Subscribe"
            className="shrink-0 text-[9px] tracking-[0.18em] uppercase text-charcoal/70 hover:text-charcoal border-b border-transparent hover:border-charcoal pb-1.5 disabled:opacity-50"
          >
            →
          </button>
        </form>
      )}
      {status === 'error' && <p className="mt-1.5 text-[9px] text-red-700/70 font-light">{errorMsg}</p>}
    </div>
  );
}
