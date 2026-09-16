// A template.tsx remounts on every navigation (unlike layout.tsx, which
// persists), so this is what gives every page a fresh, smooth entrance
// instead of content just snapping into place. Pure CSS (no JS animation
// library) -- a brief fade + slight upward settle.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
