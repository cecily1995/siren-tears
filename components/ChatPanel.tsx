'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const TOPICS = ['order', 'product', 'shipping', 'bespoke', 'other'] as const;

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations('chat');
  const [topic, setTopic] = useState<(typeof TOPICS)[number] | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.member) {
          setName(`${data.member.firstName || ''} ${data.member.lastName || ''}`.trim());
          setEmail(data.member.email || '');
        }
      })
      .catch(() => {
        /* not signed in, or lookup failed -- fine, fields just stay empty */
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/chat-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name')?.toString() || '',
          email: form.get('email')?.toString() || '',
          topic: topic || 'other',
          message: form.get('message')?.toString() || ''
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || t('errorGeneric'));
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  const inputClass =
    'w-full bg-transparent border-b border-ivory/25 focus:border-gold outline-none py-2.5 text-[0.88rem] font-light text-ivory placeholder:text-ivory/40 transition-colors';
  const labelClass = 'block text-[9px] tracking-[0.22em] uppercase text-ivory/50 mb-1.5 font-light';

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-charcoal/40" />
      <div
        className="relative w-full sm:max-w-[400px] h-full bg-[#1b1e22] text-ivory overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#1b1e22] z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-ivory/10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/90 font-light">{t('brand')}</p>
            <p className="text-[9px] tracking-[0.24em] uppercase text-ivory/50 font-light mt-1">
              {t('subBrand')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ivory/50 hover:text-ivory text-2xl leading-none px-1"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6">
          {status === 'success' ? (
            <div className="text-center py-16">
              <p className="serif-display text-[1.3rem] font-light text-ivory mb-3">
                {t('successTitle')}
              </p>
              <p className="text-[0.85rem] text-ivory/60 font-light leading-relaxed mb-8">
                {t('successBody')}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] tracking-[0.3em] uppercase text-charcoal bg-ivory px-8 py-3.5"
              >
                {t('closeCta')}
              </button>
            </div>
          ) : (
            <>
              <p className="serif-display text-[1.3rem] font-light text-ivory mb-6">{t('greeting')}</p>

              <p className={labelClass}>{t('topicLabel')}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {TOPICS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTopic(key)}
                    className={`text-[10px] tracking-[0.18em] uppercase px-3.5 py-2 border transition-colors font-light ${
                      topic === key
                        ? 'border-gold text-gold bg-gold/10'
                        : 'border-ivory/20 text-ivory/60 hover:border-ivory/40'
                    }`}
                  >
                    {t(`topics.${key}`)}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>{t('nameLabel')}</label>
                  <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('emailLabel')} *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('messageLabel')} *</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder={t('messagePlaceholder')}
                    className={inputClass}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-[0.8rem] text-red-300/90 font-light">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full text-[11px] tracking-[0.3em] uppercase text-charcoal bg-ivory px-8 py-3.5 hover:bg-ivory/90 transition-colors disabled:opacity-60"
                >
                  {status === 'submitting' ? t('sending') : t('sendCta')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
