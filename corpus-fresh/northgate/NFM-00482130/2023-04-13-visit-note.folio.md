---
folio: "0.1"
id: "01GXXYSA60C3BAR2KESXD6SJ9S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2023-04-13T11:40:00-05:00"
recorded: "2023-04-13T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No complaints.
BP 137/92, pulse 72, wt 164 lb.
Labs 4/10: eGFR 61, K 4.8, A1c 7.7%, LDL 167 mg/dL.
Reviewed labs with pt. Home BP log to bring next time.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-041377",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-041377",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-041377",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
