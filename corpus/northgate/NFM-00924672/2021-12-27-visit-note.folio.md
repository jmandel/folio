---
folio: "0.1"
id: "01FQYB9C80B84XD7JSN8BN58F2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924672"
effective: "2021-12-27T08:50:00-06:00"
recorded: "2021-12-27T10:24:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Doing OK, no chest pain or headaches.

BP 132/73, pulse 81, wt 182 lb.
Labs 12/25: eGFR 64, K 3.9, UACR 10 mg/g, LDL 126 mg/dL.

Discussed diet and exercise over the holidays. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-122774",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-122774",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-122774",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
