'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

type Order = { _id: string; orderNumber?: string; productName?: string; _createdAt?: string };

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ReturnsRepairsForm() {
  const t = useTranslations('returnsRepairsPage');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.purchases || []);
        if (data.purchases?.[0]?._id) setSelectedOrder(data.purchases[0]._id);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    setErrorMsg('');
    const incoming = Array.from(newFiles);
    const combined = [...files, ...incoming];
    if (combined.length > MAX_FILES) {
      setErrorMsg(t('formTooManyFiles'));
      return;
    }
    const tooLarge = incoming.find((f) => f.size > MAX_FILE_SIZE);
    if (tooLarge) {
      setErrorMsg(t('formFileTooLarge'));
      return;
    }
    setFiles(combined);
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = new FormData(e.currentTarget);
    form.set('orderId', selectedOrder);
    form.set('orderNumber', orderNumber.trim());
    files.forEach((f) => form.append('files', f));

    try {
      const res = await fetch('/api/returns-repairs-enquiry', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || t('formErrorGeneric'));
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg(t('formErrorGeneric'));
      setStatus('error');
    }
  }

  const label = 'block text-[0.68rem] tracking-[0.08em] uppercase text-charcoal font-normal mb-1.5';
  const input =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2 text-[0.72rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';

  if (loading) return <p className="text-[0.72rem] text-ash/60 font-light">…</p>;

  if (status === 'success') {
    return <p className="text-[0.72rem] leading-[1.7] text-charcoal font-light">{t('formSuccess')}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      <div>
        <label className={label}>{t('formFullName')} *</label>
        <input name="fullName" type="text" required className={input} />
      </div>
      <div>
        <label className={label}>{t('formEmail')} *</label>
        <input name="email" type="email" required className={input} />
      </div>
      <div>
        <label className={label}>{t('formSubject')} *</label>
        <input name="subject" type="text" required className={input} />
      </div>
      {orders.length > 0 ? (
        <div>
          <label className={label}>{t('formSelectOrder')} *</label>
          <select
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            required
            className={`${input} appearance-none`}
          >
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.orderNumber || o._id} — {o.productName || ''}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className={label}>{t('formOrderNumber')} *</label>
          <input
            name="orderNumber"
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            className={input}
          />
        </div>
      )}
      <div>
        <label className={label}>{t('formMessage')} *</label>
        <textarea name="message" required rows={4} className={`${input} resize-none`} />
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-dashed border-charcoal/25 py-3 flex items-center justify-center gap-2 text-[0.7rem] text-ash hover:text-charcoal hover:border-charcoal/40 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t('formAttachFiles')}
        </button>
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-[0.66rem] text-ash font-light">
                <span className="truncate pr-2">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label="Remove"
                  className="text-ash/60 hover:text-charcoal shrink-0"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-1.5 text-[0.6rem] text-ash/50 font-light">{t('formFileNote')}</p>
      </div>

      {status === 'error' && <p className="text-[0.68rem] text-red-700/80 font-light">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="text-[0.68rem] tracking-[0.2em] uppercase text-ivory bg-charcoal px-7 py-3 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('formSubmitting') : t('formSubmit')}
      </button>
    </form>
  );
}
