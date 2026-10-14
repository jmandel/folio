---
folio: "0.1"
id: "01J36PS1M06628KX8XFARM17BM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00316587"
effective: "2024-07-19T14:45:00-05:00"
recorded: "2024-07-19T18:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 122/75, pulse 70, wt 185 lb.
Labs 7/15: eGFR 36, K 4.4, A1c 7.8%, LDL 82.
Referred to nephrology for the low eGFR.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071914",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071914",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
