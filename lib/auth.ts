import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto';

// --- Password hashing -------------------------------------------------
// Uses Node's built-in scrypt (no extra dependency). Never store or log
// the raw password. Format stored in Sanity: "<salt-hex>:<hash-hex>".

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string | undefined | null): boolean {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  try {
    const hashBuffer = Buffer.from(hash, 'hex');
    const suppliedHashBuffer = scryptSync(password, salt, 64);
    if (hashBuffer.length !== suppliedHashBuffer.length) return false;
    return timingSafeEqual(hashBuffer, suppliedHashBuffer);
  } catch {
    return false;
  }
}

// --- Session token -----------------------------------------------------
// A small HMAC-signed payload (not encrypted -- it only carries a member id
// and email, nothing secret) stored in an httpOnly cookie. Verifying just
// recomputes the signature and checks it matches + hasn't expired.

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function getSecret(): string | null {
  return process.env.SESSION_SECRET || null;
}

export type SessionPayload = { id: string; email: string };

export function createSessionToken(payload: SessionPayload): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + SESSION_MAX_AGE_MS;
  const data = JSON.stringify({ ...payload, exp });
  const base = Buffer.from(data, 'utf8').toString('base64url');
  const sig = createHmac('sha256', secret).update(base).digest('base64url');
  return `${base}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  const secret = getSecret();
  if (!secret || !token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [base, sig] = parts;
  try {
    const expectedSig = createHmac('sha256', secret).update(base).digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null;
    const data = JSON.parse(Buffer.from(base, 'base64url').toString('utf8'));
    if (!data.exp || Date.now() > data.exp) return null;
    return { id: data.id, email: data.email };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = 'st_session';
export const SESSION_COOKIE_MAX_AGE = Math.floor(SESSION_MAX_AGE_MS / 1000);

// --- Password reset token ----------------------------------------------
// Same HMAC-signing approach as the session token, but short-lived (1 hour)
// and single-purpose (carries only the member id + a "purpose" tag so it
// can never be mistaken for a login session token).

const RESET_TOKEN_MAX_AGE_MS = 1000 * 60 * 60; // 1 hour

export function createResetToken(memberId: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + RESET_TOKEN_MAX_AGE_MS;
  const data = JSON.stringify({ id: memberId, purpose: 'reset', exp });
  const base = Buffer.from(data, 'utf8').toString('base64url');
  const sig = createHmac('sha256', secret).update(base).digest('base64url');
  return `${base}.${sig}`;
}

export function verifyResetToken(token: string | undefined | null): { id: string } | null {
  const secret = getSecret();
  if (!secret || !token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [base, sig] = parts;
  try {
    const expectedSig = createHmac('sha256', secret).update(base).digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null;
    const data = JSON.parse(Buffer.from(base, 'base64url').toString('utf8'));
    if (data.purpose !== 'reset' || !data.exp || Date.now() > data.exp) return null;
    return { id: data.id };
  } catch {
    return null;
  }
}
