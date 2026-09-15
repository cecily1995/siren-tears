import { useState } from 'react';
import { useClient } from 'sanity';
import { CheckmarkCircleIcon } from '@sanity/icons';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';

const TERMINAL_STATUSES = ['paid', 'shipped'];

// Manual fallback for the "auto-mark Shop Product as Sold" automation.
// The automatic version relies on a Sanity webhook calling our website,
// which needs external configuration (Vercel env var + Sanity webhook
// settings) that's easy to get wrong or forget. This button does the same
// patch directly from inside the Studio -- using the same login session
// you're already using to edit -- so it works even if that webhook was
// never set up or is misconfigured.
export const markProductsSoldAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { id, type, published, draft, onComplete } = props;
  const client = useClient({ apiVersion: '2024-09-01' });
  const [isSyncing, setIsSyncing] = useState(false);

  if (type !== 'purchaseRequest') return null;

  const doc: any = published || draft;
  const status: string | undefined = doc?.status;
  const items: any[] = doc?.items || [];
  const productIds: string[] = items
    .map((item) => item?.product?._ref)
    .filter((ref): ref is string => Boolean(ref));

  if (!productIds.length) return null;

  const isTerminal = Boolean(status && TERMINAL_STATUSES.includes(status));

  return {
    label: isSyncing ? '正在标记...' : '标记关联商品为已售出',
    icon: CheckmarkCircleIcon,
    disabled: !isTerminal || isSyncing,
    title: isTerminal
      ? '把这份购买申请里关联的商品都标记为 Sold(已售出)'
      : '先把 Status 改成 Paid 或 Shipped 并发布,才能标记商品为已售出',
    onHandle: async () => {
      setIsSyncing(true);
      try {
        const tx = client.transaction();
        productIds.forEach((productId) => {
          tx.patch(productId, { set: { status: 'sold' } });
        });
        await tx.commit();
      } catch (err) {
        console.error('Manual mark-sold failed', err);
      } finally {
        setIsSyncing(false);
        onComplete();
      }
    }
  };
};
