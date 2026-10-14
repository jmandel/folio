---
folio: "0.1"
id: "01KV9BVRE08WD7DSKJADKZ2QC2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00302644"
effective: "2026-06-16T13:20:00-05:00"
recorded: "2026-06-16T18:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels OK.
BP 153/102, repeat 150/101, pulse 72, wt 205 lb.
eGFR 77, A1c 7.1%. K 6.2 on first draw, hemolyzed; repeat K 4.5.
BP above goal: chlorthalidone started 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-061676",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-061676",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-061676",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-061676",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
