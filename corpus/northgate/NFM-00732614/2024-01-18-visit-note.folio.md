---
folio: "0.1"
id: "01HMF33PE0HRY6C70TRXVCTXRT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00732614"
effective: "2024-01-18T08:50:00-06:00"
recorded: "2024-01-18T14:10:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.

BP 131/72, pulse 77, wt 200 lb.
Labs from 1/14: eGFR 80, K 4.4, UACR 100 mg/g, A1c 6.3%, LDL 96 mg/dL.

Results reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011897",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-011897",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
