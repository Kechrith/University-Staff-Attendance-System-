"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns true only once the component has mounted on the client.
 * Implemented with `useSyncExternalStore` (instead of a `useEffect` +
 * `setState` pair) so client-only rendering (theme, formatted dates, etc.)
 * doesn't trigger the "setState in effect" cascading-render lint rule.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
