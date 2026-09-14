/**
 * "Next section pulls up and covers the previous one" — implemented with
 * plain position:sticky and z-index stacking, deliberately with NO forced
 * heights on either panel. Both sections keep their own natural height;
 * neither one is stretched to fill the viewport, so there's no risk of
 * blank leftover space if content happens to be shorter than a screen.
 *
 * `below` sticks to the top of the viewport as the page scrolls past it,
 * then naturally scrolls away once its own height is exhausted. `above`
 * follows right after in the document, is also sticky, and sits at a
 * higher z-index with its own opaque background — so as it reaches the
 * top of the viewport it visually rises up and settles over `below`
 * instead of just fading in. This is driven entirely by native scroll
 * position (not JS/transform math), so it reverses naturally when
 * scrolling back up and behaves correctly with normal touch scrolling.
 */
export default function PullUpStack({
  below,
  above
}: {
  below: React.ReactNode;
  above: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="sticky top-0 z-0">{below}</div>
      <div className="sticky top-0 z-10">{above}</div>
    </div>
  );
}
