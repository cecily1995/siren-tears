import { useState } from 'react';
import { EnvelopeIcon } from '@sanity/icons';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';

// Companion to markProductsSoldAction: once an order's shippingStatus is
// 'shipped' and a tracking number is filled in (and the doc published),
// this button sends the customer their shipping notification email via
// /api/admin/notify-shipped. Manual rather than automatic for the same
// reason markProductsSoldAction is manual -- no extra webhook wiring to
// misconfigure, and the admin stays in control of exactly when it sends.
export const notifyShippedAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { id, type, published, draft, onComplete } = props;
  const [isSending, setIsSending] = useState(false);
  const [sentOnce, setSentOnce] = useState(false);

  if (type !== 'purchaseRequest') return null;

  const doc: any = published || draft;
  const shippingStatus: string | undefined = doc?.shippingStatus;
  const trackingNumber: string | undefined = doc?.trackingNumber;
  const email: string | undefined = doc?.email;
  const isDraft = !published;

  const canSend = shippingStatus === 'shipped' && Boolean(trackingNumber) && Boolean(email) && !isDraft;

  return {
    label: isSending ? '正在发送...' : sentOnce ? '发货邮件已发送' : '发送发货通知邮件',
    icon: EnvelopeIcon,
    disabled: !canSend || isSending || sentOnce,
    title: !email
      ? '这份订单没有邮箱地址'
      : isDraft
        ? '先发布(Publish)这份文档才能发送'
        : !canSend
          ? '先把 Shipping status 改成 Shipped、填好 NZ Post 运单号并发布,才能发送通知邮件'
          : '给客人发一封"您的订单已发货"邮件,包含运单号',
    onHandle: async () => {
      setIsSending(true);
      try {
        const res = await fetch('/api/admin/notify-shipped', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ purchaseRequestId: id.replace(/^drafts\./, '') })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          console.error('Shipping notification email failed', data.error);
        } else {
          setSentOnce(true);
        }
      } catch (err) {
        console.error('Shipping notification request failed', err);
      } finally {
        setIsSending(false);
        onComplete();
      }
    }
  };
};
