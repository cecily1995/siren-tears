// Shared HTML email templates for order confirmation and shipping
// notification. Deliberately simple inline-styled HTML (no external CSS,
// no images) since that's what renders reliably across email clients.

type OrderItem = { productName?: string; price?: number };

type OrderForEmail = {
  orderNumber?: string;
  name?: string;
  items?: OrderItem[];
  shippingMethod?: string;
  shippingCost?: number;
  deliveryFirstName?: string;
  deliveryLastName?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryRegion?: string;
  deliveryPostalCode?: string;
  country?: string;
  trackingNumber?: string;
};

function wrap(bodyHtml: string): string {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #26231f; max-width: 560px; margin: 0 auto;">
      <div style="text-align: center; padding: 32px 0 24px; border-bottom: 1px solid #e5e0d5;">
        <p style="font-size: 13px; letter-spacing: 6px; text-transform: uppercase; color: #26231f; margin: 0;">Siren Tears</p>
      </div>
      <div style="padding: 32px 8px;">
        ${bodyHtml}
      </div>
      <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e5e0d5; color: #8a8578; font-size: 12px;">
        <p style="margin: 0;">Siren Tears Atelier &middot; New Zealand</p>
      </div>
    </div>
  `;
}

function itemsTable(items: OrderItem[] = []): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f0ede4; font-size: 14px;">${item.productName || ''}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f0ede4; font-size: 14px; text-align: right;">
            ${typeof item.price === 'number' ? `NZD $${item.price}` : ''}
          </td>
        </tr>`
    )
    .join('');
  return `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">${rows}</table>`;
}

function addressBlock(order: OrderForEmail): string {
  const recipient = [order.deliveryFirstName, order.deliveryLastName].filter(Boolean).join(' ') || order.name || '';
  const lines = [order.deliveryAddress, order.deliveryCity, order.deliveryRegion, order.deliveryPostalCode, order.country]
    .filter(Boolean)
    .join(', ');
  return `<p style="font-size: 14px; line-height: 1.7; margin: 0;">${recipient}<br />${lines}</p>`;
}

export function orderConfirmationEmail(order: OrderForEmail): { subject: string; html: string } {
  const subject = `Your Siren Tears order is confirmed — ${order.orderNumber || ''}`;
  const html = wrap(`
    <p style="font-size: 20px; font-weight: normal; margin: 0 0 8px;">Thank you for your order.</p>
    <p style="font-size: 14px; color: #5c564e; line-height: 1.7; margin: 0 0 24px;">
      Your payment has been received. Our Atelier will prepare your piece for shipping and will be in touch with tracking details.
    </p>
    <p style="font-size: 13px; color: #8a8578; margin: 0 0 4px;">Order number</p>
    <p style="font-size: 16px; margin: 0 0 24px;">${order.orderNumber || ''}</p>
    ${itemsTable(order.items)}
    <p style="font-size: 13px; color: #8a8578; margin: 24px 0 4px;">Shipping</p>
    <p style="font-size: 14px; margin: 0 0 8px;">
      ${order.shippingMethod || ''}${typeof order.shippingCost === 'number' ? ` (${order.shippingCost === 0 ? 'Free' : `NZD $${order.shippingCost}`})` : ''}
    </p>
    ${addressBlock(order)}
  `);
  return { subject, html };
}

export function shippingNotificationEmail(order: OrderForEmail): { subject: string; html: string } {
  const subject = `Your Siren Tears order has shipped — ${order.orderNumber || ''}`;
  const html = wrap(`
    <p style="font-size: 20px; font-weight: normal; margin: 0 0 8px;">Your order is on its way.</p>
    <p style="font-size: 14px; color: #5c564e; line-height: 1.7; margin: 0 0 24px;">
      Your piece has been carefully packaged and handed to NZ Post.
    </p>
    <p style="font-size: 13px; color: #8a8578; margin: 0 0 4px;">Order number</p>
    <p style="font-size: 16px; margin: 0 0 24px;">${order.orderNumber || ''}</p>
    ${
      order.trackingNumber
        ? `
    <p style="font-size: 13px; color: #8a8578; margin: 0 0 4px;">Tracking number</p>
    <p style="font-size: 16px; margin: 0 0 8px;">${order.trackingNumber}</p>
    <p style="font-size: 14px; margin: 0 0 24px;">
      <a href="https://www.nzpost.co.nz/tools/tracking" style="color: #26231f;">Track with NZ Post</a>
    </p>`
        : ''
    }
    ${itemsTable(order.items)}
    <p style="font-size: 13px; color: #8a8578; margin: 24px 0 4px;">Shipping to</p>
    ${addressBlock(order)}
  `);
  return { subject, html };
}
