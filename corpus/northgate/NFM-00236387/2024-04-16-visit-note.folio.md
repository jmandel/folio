---
folio: "0.1"
id: "01HVMJE8R06RQR7GHNFXNBTWD4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00236387"
effective: "2024-04-16T14:10:00-05:00"
recorded: "2024-04-16T18:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 140/85, repeat 138/84, pulse 73, wt 187 lb.
Labs 4/14: eGFR 75, K 4.8, UACR 202 mg/g, A1c 6.5%.
A1c at goal. Urine albumin still elevated, will keep following.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-041676",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-041676",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-041676",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
