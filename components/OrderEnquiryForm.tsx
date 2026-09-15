'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

type Order = {
  _id: string;
  orderNumber?: string;
  productName?: string;
  itemCount?: number;
  status?: string;
  _createdAt?: string;
};

export default function OrderEnquiryForm() {
  const t = useTranslations('orderEnquiry');
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setLoggedIn(!!data.member);
        setOrders(data.purchases || []);
        if (data.purchases?.[0]?._id) setSelectedOrder(data.purchases[0]._id);
      })
      .catch(() => setLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/order-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder,
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
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

  if (loading) {
    return <p className="text-[0.85rem] text-ash/60 font-light">…</p>;
  }

  if (!loggedIn) {
    return (
      <div>
        <p className="text-[0.9rem] text-ash font-light leading-relaxed mb-4">{t('signInPrompt')}</p>
        <Link
          href="/account"
          className="text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline"
        >
          {t('signInCta')}
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-[0.9rem] text-ash font-light leading-relaxed">{t('noOrders')}</p>;
  }

  if (status === 'success') {
    return <p className="text-[0.9rem] text-charcoal font-light leading-relaxed">{t('successMessage')}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label className={labelClass}>{t('selectOrderLabel')}</label>
        <select
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className={inputClass}
        >
          {orders.map((o) => (
            <option key={o._id} value={o._id}>
              {o.orderNumber || o._id.slice(0, 8)} — {o.productName}
              {o.itemCount && o.itemCount > 1 ? ` +${o.itemCount - 1}` : ''}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>{t('messageLabel')}</label>
        <textarea name="message" rows={4} required className={inputClass} />
      </div>
      {status === 'error' && <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('sendCta')}
      </button>
    </form>
  );
}
