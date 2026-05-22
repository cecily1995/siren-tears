/**
 * Embedded Sanity Studio.
 * Available at /studio when NEXT_PUBLIC_SANITY_PROJECT_ID is set.
 */

import { Studio } from './Studio';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <Studio />;
}
