'use client';

import { useEffect, useState } from 'react';
import type { Offer } from '@/types/offer';

/**
 * Client-side access to the live offer catalogue served from /offers.json.
 *
 * Pages send the ids they scope to and the first page of records; everything
 * beyond that — filtering, paging, matching against a saved card wallet — is
 * answered from this one shared fetch instead of from data inlined into each
 * page's HTML. See the route handler for why.
 *
 * The cache is module scope, so it survives navigation between pages and two
 * components mounted together share a single request.
 */
let cache: Offer[] | null = null;
let inFlight: Promise<Offer[]> | null = null;

export function loadCatalogue(): Promise<Offer[]> {
  if (cache) return Promise.resolve(cache);
  inFlight ??= fetch('/offers.json')
    .then((response) => {
      if (!response.ok) throw new Error(`offers.json responded ${response.status}`);
      return response.json() as Promise<Offer[]>;
    })
    .then((offers) => {
      cache = offers;
      return offers;
    })
    .catch((error) => {
      // Clear the slot so a later mount can retry rather than resolving the
      // whole session against one failed request.
      inFlight = null;
      throw error;
    });
  return inFlight;
}

/**
 * The catalogue, or null until it arrives.
 *
 * Fetched when the browser goes idle rather than during hydration: every caller
 * already has enough server-rendered content to paint, and this keeps a
 * ~400 KB response off the critical path.
 */
export function useCatalogue(): Offer[] | null {
  const [offers, setOffers] = useState<Offer[] | null>(cache);

  useEffect(() => {
    if (offers) return;
    let cancelled = false;
    const start = () => {
      loadCatalogue()
        .then((loaded) => {
          if (!cancelled) setOffers(loaded);
        })
        .catch(() => {
          /* Callers keep showing their server-rendered fallback. */
        });
    };

    // Safari only shipped requestIdleCallback recently; fall back to a short
    // timer there rather than skipping the prefetch.
    const idle = typeof window.requestIdleCallback === 'function';
    const handle = idle ? window.requestIdleCallback(start, { timeout: 2000 }) : window.setTimeout(start, 200);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [offers]);

  return offers;
}
