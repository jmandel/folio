import { useEffect, useState } from "react";
import type { DidDocument, Envelope } from "@folio/core";
import { check, didDocument, didDocumentUrl, jwtParts, schemaDigest, tamper, type Check } from "../lib/verify.ts";
import { Seal } from "./ItemDoc.tsx";

/** The inspectable signature details for one signed item, and a one-character tamper test. */
export function Provenance({ sdJwt, result, env }: { sdJwt: string; result?: Check; env: Envelope }) {
  const [schema, setSchema] = useState<{ sha256: string; url: string; bytes: number } | { error: string } | null>(null);
  const [did, setDid] = useState<DidDocument | null>(null);
  const [tampered, setTampered] = useState<{ what: string; result: Check } | null>(null);
  const [open, setOpen] = useState(false);
  const jp = jwtParts(sdJwt);
  const total = jp.claims.units?._sd?.length ?? 0;

  useEffect(() => {
    setTampered(null);
    setSchema(null);
    if (!open) return;
    if (env.schema) schemaDigest(env.schema.url).then(setSchema, (e) => setSchema({ error: String(e.message) }));
    didDocument(env.issuer).then(setDid, () => setDid(null));
  }, [open, env.id, env.issuer, env.schema]);

  const runTamper = async () => {
    const t = tamper(sdJwt);
    setTampered({ what: t.what, result: await check(t.sdJwt) });
  };

  return (
    <details className="prov" onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary>Signature and provenance</summary>
      <dl className="prov-grid">
        <dt>Signature</dt>
        <dd>
          {!result ? (
            <Seal state="wait" label="Checking…" />
          ) : result.ok ? (
            <Seal state="ok" label={`Verified in this browser (Ed25519, ${result.ms.toFixed(1)} ms)`} />
          ) : (
            <Seal state="bad" label={`Failed: ${result.error}`} />
          )}
        </dd>
        <dt>Issuer</dt>
        <dd>
          <code>{env.issuer}</code>
        </dd>
        <dt>Signing key</dt>
        <dd>
          <code>{jp.header.kid}</code>
          <div className="small muted">
            {jp.header.alg}, {jp.header.typ}
          </div>
        </dd>
        <dt>DID document</dt>
        <dd>
          <a href={didDocumentUrl(env.issuer)} target="_blank" rel="noopener">
            {didDocumentUrl(env.issuer).replace(location.origin, "")}
          </a>
          <div className="small muted">did:web resolution, with the issuer host mapped to this site</div>
          {did && <pre className="json">{JSON.stringify(did.verificationMethod?.[0]?.publicKeyJwk ?? did, null, 2)}</pre>}
        </dd>
        <dt>Schema</dt>
        <dd>
          {env.schema ? (
            <>
              <code>{env.schema.type}</code> in <code>{env.schema.url}</code>
              <div className="small">
                Declared SHA-256 <code>{env.schema.sha256.slice(0, 16)}…</code>
              </div>
              {schema && "sha256" in schema && (
                <div className="check-line small">
                  {schema.sha256 === env.schema.sha256 ? (
                    <Seal state="ok" label={`Fetched schema (${schema.bytes.toLocaleString()} bytes) hashes to the declared value`} />
                  ) : (
                    <Seal state="bad" label={`Fetched schema hashes to ${schema.sha256.slice(0, 16)}…, not the declared value`} />
                  )}
                </div>
              )}
              {schema && "error" in schema && <Seal state="bad" label={schema.error} />}
            </>
          ) : (
            <span className="muted">No payload, so no schema.</span>
          )}
        </dd>
        <dt>Disclosure units</dt>
        <dd>
          {total} unit{total === 1 ? "" : "s"} (payload entries and narrative-only spans), {jp.disclosures.length} disclosed here
        </dd>
        {(env.supersedes?.length || env.retracts?.length) && (
          <>
            <dt>Replaces</dt>
            <dd>
              {env.supersedes?.length ? <>Supersedes {env.supersedes.map((s) => <code key={s}>{s} </code>)}</> : null}
              {env.retracts?.length ? <>Retracts {env.retracts.map((s) => <code key={s}>{s} </code>)}</> : null}
            </dd>
          </>
        )}
        <dt>Signed claims</dt>
        <dd>
          <details>
            <summary className="small">Header and claims of the issuer-signed JWT</summary>
            <pre className="json">{JSON.stringify({ header: jp.header, claims: jp.claims }, null, 2)}</pre>
          </details>
        </dd>
        <dt>As served</dt>
        <dd>
          <details>
            <summary className="small">The .folio.sd-jwt text ({sdJwt.length.toLocaleString()} characters)</summary>
            <pre className="json">{sdJwt}</pre>
          </details>
        </dd>
      </dl>
      <div className="tamper">
        <div className="check-line">
          <button className="btn" onClick={runTamper}>
            Change one character and check again
          </button>
          <span className="small muted">Alters a copy in memory; the item above is unchanged.</span>
        </div>
        {tampered && (
          <div className="small" style={{ marginTop: 8 }} data-testid="tamper-result">
            <div>{tampered.what}</div>
            <div style={{ marginTop: 4 }}>
              {tampered.result.ok ? <Seal state="ok" label="Still verifies (unexpected)" /> : <Seal state="bad" label={`Check fails: ${tampered.result.error}`} />}
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
