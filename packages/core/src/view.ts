// Default reader view (spec/record-item.md#default-reader-view): every item not superseded or
// retracted by another item from the same issuer. Works over any set of items, from any issuers.

import { itemKey } from "./item.ts";

/** What the view needs from an item (an Item, an Envelope, or an index row). */
export interface Linkable {
  issuer: string;
  id: string;
  supersedes?: string[];
  retracts?: string[];
}

export interface ViewResult<T extends Linkable> {
  /** Items in the default view, in input order. */
  current: T[];
  /** Hidden items: key → keys of the items that superseded it. */
  superseded: Map<string, string[]>;
  /** Hidden items: key → keys of the items that retracted it. */
  retracted: Map<string, string[]>;
  /**
   * Ids named by `supersedes`/`retracts` that are not (yet) in the set. A late-arriving item with
   * one of these keys is hidden when the view is recomputed.
   */
  replacedButUnseen: string[];
  /** Items superseded by two or more current items, none of which supersedes the other. */
  conflicts: { item: string; by: string[] }[];
}

export function defaultView<T extends Linkable>(items: T[]): ViewResult<T> {
  const byKey = new Map(items.map((it) => [itemKey(it), it]));
  const superseded = new Map<string, string[]>();
  const retracted = new Map<string, string[]>();
  const add = (m: Map<string, string[]>, k: string, by: string) => m.set(k, [...(m.get(k) ?? []), by]);
  for (const it of items) {
    // Ids are issuer-local, so a reference can only name an item of the same issuer.
    for (const id of it.supersedes ?? []) if (id !== it.id) add(superseded, itemKey({ issuer: it.issuer, id }), itemKey(it));
    for (const id of it.retracts ?? []) if (id !== it.id) add(retracted, itemKey({ issuer: it.issuer, id }), itemKey(it));
  }
  const hidden = (k: string) => superseded.has(k) || retracted.has(k);
  const current = items.filter((it) => !hidden(itemKey(it)));
  const replacedButUnseen = [...new Set([...superseded.keys(), ...retracted.keys()])].filter((k) => !byKey.has(k));

  // Conflict: two current items supersede the same item. (Since both are current, neither
  // supersedes the other, directly or transitively.)
  const conflicts: { item: string; by: string[] }[] = [];
  for (const [k, by] of superseded) {
    const currentBy = [...new Set(by)].filter((b) => !hidden(b));
    if (currentBy.length > 1) conflicts.push({ item: k, by: currentBy });
  }
  return { current, superseded, retracted, replacedButUnseen, conflicts };
}
