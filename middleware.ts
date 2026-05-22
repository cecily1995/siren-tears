import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all routes except API, Next internals, the Sanity Studio, and static files.
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)']
};
