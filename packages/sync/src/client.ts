// Sync client (spec/sync.md): pages through one patient's feed at one node.

export interface SyncPage {
  issuer: string;
  patient: string;
  items: string[];
  next: string;
  more: boolean;
}

export type Fetch = (url: string) => Promise<Response>;

export interface PullOptions {
  /** Base URL of the node (where its did:web host is served from, after any dev mapping). */
  baseUrl: string;
  patient: string;
  /** Cursor from the previous sync; omit to start from the beginning. */
  since?: string;
  limit?: number;
  fetch?: Fetch;
}

/** Yields pages until the node says there is no more. The last page's `next` is the new cursor. */
export async function* pullPages(opts: PullOptions): AsyncGenerator<SyncPage> {
  const doFetch = opts.fetch ?? ((u: string) => fetch(u));
  let since = opts.since;
  for (;;) {
    const u = new URL(`${opts.baseUrl.replace(/\/$/, "")}/patients/${encodeURIComponent(opts.patient)}/sync`);
    if (since) u.searchParams.set("since", since);
    if (opts.limit) u.searchParams.set("limit", String(opts.limit));
    const res = await doFetch(u.toString());
    if (res.status === 410) {
      // The node cannot honour the cursor: start over. Items are immutable and the receiver
      // de-duplicates by (issuer, id), so re-delivery is harmless.
      if (!since) throw new Error(`sync ${u}: 410 without a cursor`);
      since = undefined;
      continue;
    }
    if (!res.ok) throw new Error(`sync ${u}: HTTP ${res.status} ${await res.text()}`);
    const page = (await res.json()) as SyncPage;
    if (!Array.isArray(page.items) || typeof page.next !== "string") throw new Error(`sync ${u}: malformed page`);
    yield page;
    since = page.next;
    if (!page.more) return;
  }
}
