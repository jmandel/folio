---
folio: "0.1"
id: "01H3YX1KK0DS4F8X0Q255K3EVV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00725765"
effective: "2023-06-27T10:20:00-05:00"
recorded: "2023-06-27T12:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 140/91, pulse 78, wt 192 lb.

Pt feels well, no headache or chest pain. Reviewed home BP log and diet.

No changes today. Recheck BP at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-062731",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-062731",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
