---
folio: "0.1"
id: "01K6BQFR6048R2VYV0V0YNZNSG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00089203"
effective: "2025-09-29T14:30:00-05:00"
recorded: "2025-09-29T16:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 140/86, pulse 71, wt 200 lb.
eGFR 57 today, K 4. UACR 825 mg/g.
LDL 68 mg/dL.
Discussed labs with pt. No new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092919",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092919",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-092919",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
