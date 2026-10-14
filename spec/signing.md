# Signing and disclosure

Draft 0, 2026-10-13. Normative unless marked as an example or a note.

This profile says how an issuer signs a [record item](record-item.md) so that a holder (the patient,
or an agent acting for her) can later show it with parts withheld, and a receiver can check the
issuer's signature over whatever was shown. It uses SD-JWT ([RFC 9901](https://www.rfc-editor.org/rfc/rfc9901))
with an Ed25519 issuer key found through `did:web`. The key words MUST, SHOULD and MAY are used as
in RFC 2119.

## Disclosure units

An item is split into the parts below. The first two are always shown; each **unit** is shown or
withheld as a whole.

| Part | Shown | What it holds |
|---|---|---|
| Envelope | always | every envelope field, known or unknown |
| Prose | always | the narrative with every ref span cut out |
| Entry unit | selectable | one payload entry, plus the exact text of every span with the entry's id |
| Narrative-only unit | selectable | the exact text of every span whose id has no payload entry |

Each payload entry is one unit whether or not it has spans. Several spans with one id belong to one
unit. This implements [span boundaries are disclosure boundaries](record-item.md#span-boundaries-are-disclosure-boundaries).

## Keys and discovery

- The issuer's DID is the item's `issuer`, a `did:web` DID. Its DID document is found by the
  `did:web` method: `did:web:host` → `https://host/.well-known/did.json`; `did:web:host:a:b` →
  `https://host/a/b/did.json`.
- The signing key MUST be listed in the document's `verificationMethod` with a `publicKeyJwk`
  (`kty` `OKP`, `crv` `Ed25519`), and its id MUST be listed in `assertionMethod`. The document's `id`
  MUST equal the DID.
- The JOSE algorithm is `EdDSA` with an Ed25519 key. Ed25519 was chosen because signatures are
  deterministic (no per-signature nonce to get wrong), keys are one 32-byte value, and WebCrypto
  supports it in Bun and in current browsers.
- Development nodes run on localhost under their real DIDs. A reader MAY map a DID host to a local
  base URL for testing; the DID, `kid` and items stay unchanged.

## The signed item

A signed item is an SD-JWT: an issuer-signed JWT followed by one disclosure per unit.

**Header.** `typ` = `folio-item+sd-jwt`, `alg` = `EdDSA`, `kid` = the DID URL of the signing key
(e.g. `did:web:lakeview-labs.example#folio-demo-1`). The DID part of `kid` MUST equal `iss`.

**Claims.**

| Claim | Value |
|---|---|
| `iss` | the item's `issuer` |
| `_sd_alg` | `sha-256` |
| `envelope` | the envelope as a JSON object: every top-level field of the item's JSON form except `narrative` and `payload`, in that order |
| `narrative` | array of strings: the prose segments. With the item's spans numbered 0…n−1 in document order (each span is one *slot*), `narrative[k]` is the text before slot k and `narrative[n]` the text after the last slot. Spans are cut out together with their `<ref …>` and `</ref>` tags. |
| `units` | an object whose only member is `_sd`: one digest per unit |

No other claims are used. `iat`, `exp` and `cnf` are not used: `recorded` says when the item was
committed, and items do not expire.

**Disclosures.** Each unit is an object-property disclosure of `units`
(RFC 9901 §4.2.1): `[salt, unit id, value]`, where the unit id is the entry id or the narrative-only
span id and the value is:

```json
{ "entry": { ... }, "pos": 3, "spans": [ { "slot": 1, "text": "Na 132" } ] }
```

- `entry`: the payload entry, as in the item. Absent for a narrative-only unit.
- `pos`: the entry's zero-based position in the payload's key order. Present if and only if `entry` is.
- `spans`: one object per span with this id: its slot number and its exact inner text (inline
  Markdown, without the ref tags). Absent for an entry without spans.

Rules for issuers:

- Every unit MUST be selectively disclosable; the issuer MUST NOT put payload entries or span
  text anywhere else.
- Salts MUST carry at least 128 bits from a cryptographically secure generator.
- Decoy digests MUST NOT be used. The number of units is meant to be visible, so that a receiver
  can say how many parts were withheld.
- Each slot belongs to exactly one unit; each `pos` to exactly one entry unit.

Joining `narrative[0]`, slot 0 as `<ref id="ID">text</ref>`, `narrative[1]`, … restores the
narrative exactly. Ordering the entries by `pos` restores the payload, key order included. So a
presentation with every disclosure yields the original item, identical in its JSON form.

## What is hashed and signed

Nothing is canonicalized. The issuer serializes each JSON value once; everything after works on
those bytes.

- The JWS signature covers the ASCII bytes of `BASE64URL(header) || "." || BASE64URL(claims)`,
  where `claims` is the issuer's UTF-8 JSON serialization of the claim set (RFC 7515).
- Each disclosure is `BASE64URL(UTF-8 JSON of [salt, unit id, value])` as the issuer wrote it. Its
  digest, listed in `units._sd`, is `BASE64URL(SHA-256(ASCII bytes of that disclosure string))`
  (RFC 9901 §4.2.3).
- Receivers decode and parse these exact strings; they never re-serialize before checking.

So the prose outside spans and the envelope are covered by the signature directly, and each
unit's span text and entry are covered through their digests. Changing one character anywhere
breaks either the signature or a digest.

## Presentations

A presentation is the issuer-signed JWT followed by the disclosures of the units being shown, in
the SD-JWT compact form (`<JWT>~<disclosure>~…~`). The holder chooses units; it cannot change
anything else. Key binding JWTs are not used in this version: the presentation MUST end with `~`,
and a receiver MUST reject one that carries a key binding JWT. (Binding presentations to a holder
key and an audience is a candidate for the agent-to-agent stage.)

A sync node serves each item as a presentation of all its units.

## Verification

A receiver MUST:

1. Check the header: `typ`, `alg` = `EdDSA`, and a `kid` whose DID part equals `iss`.
2. Resolve the `kid` through `did:web` and check it is an `assertionMethod` of that DID.
3. Verify the JWS signature with that key.
4. Check the disclosures as RFC 9901 §7.1 requires: each digest appears in `units._sd`, none
   appears twice, and none is unreferenced.
5. Check the FOLIO structure: `envelope.issuer` equals `iss`; every element of `narrative` is a
   string with no `<ref` or `</ref>`; each disclosed unit has `entry` or `spans`; every `slot` is
   in range and filled at most once; every `pos` is in range and used at most once; span text
   contains no ref tags.
6. If it expected a particular issuer, check `iss`.
7. Rebuild what was shown: the prose with each disclosed span in its slot and a **withheld
   marker** in each other slot; the disclosed entries ordered by `pos`; and the number of withheld
   units, which is the number of digests in `units._sd` minus the number of disclosures.

If nothing is withheld, the result is the item and MUST pass [record item](record-item.md)
validation.

## Showing a partial item

When a presentation withholds anything, a receiver's display:

- MUST show, before the content, that the item is partial and how many parts were withheld;
- MUST show a visible marker at each withheld slot in the narrative (the reference code uses
  `⟦withheld⟧`), so the reader sees where text is missing;
- MUST show that structured entries may be missing (withheld entries without spans have no
  place in the narrative to mark);
- MUST NOT store, forward or render the result as a complete `.folio.md` or `.folio.json` item.

Withholding hides each unit's id, span text and entry. It does not hide that the unit exists, how
many there are, or where in the prose a withheld span sat.

## Context loss

Withholding a span can change what the rest of the note means, not only remove a fact.

Example. Lakeview's 2026-07-13 nephrology note reads:

> Na 132, mild. Chlorthalidone likely; `<ref id="na_sertraline">`sertraline (disclosed at intake)
> may contribute`</ref>`. No change today.

Presented without `na_sertraline`, the receiver sees:

> Na 132, mild. Chlorthalidone likely; ⟦withheld⟧. No change today.

The disclosed text now reads as if chlorthalidone were the only suspected cause of the low sodium.
A clinician may change the diuretic and leave the real contributor in place. The marker says
something is missing; it cannot say what.

So a presenter (the patient's app or agent) MUST, before sharing:

- show the holder the item exactly as the receiver will see it, with markers in place;
- say that withholding can change the meaning of what is shown, and that the receiver will see
  that something was withheld;
- show the always-shared parts: the envelope (issuer, author and role, schema type, dates) and
  the prose outside spans. These can be revealing on their own (an author whose role is
  "Psychiatrist"); the only way to withhold them is not to share the item.

A receiver SHOULD treat a partial item as incomplete evidence and ask when a withheld part could
matter to its decision.

## Example

The claims for a short note (salts and digests shortened). Narrative:
`Na 132. <ref id="dx_na">Hyponatremia</ref>, mild.`

```json
{
  "iss": "did:web:maple-street-clinic.example",
  "envelope": { "folio": "0.1", "id": "01JB7Q3M5V8XKZ2N4R6T9WCYDE", "issuer": "did:web:maple-street-clinic.example", "...": "..." },
  "narrative": ["Na 132. ", ", mild."],
  "units": { "_sd": ["Qm9...", "dGh..."] },
  "_sd_alg": "sha-256"
}
```

Disclosures (decoded): `["c2Fs...", "dx_na", {"entry": {"type": "dx", "icd10cm": "E87.1"}, "pos": 0, "spans": [{"slot": 0, "text": "Hyponatremia"}]}]`
and `["b3R...", "na_lab", {"entry": {"type": "lab", "value": 132}, "pos": 1}]`. Withholding `dx_na`
shows `Na 132. ⟦withheld⟧, mild.` and one entry.
