---
folio: "0.1"
id: "01JBYPXWY0CEJNGQ2MVGQSS07M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00978964"
effective: "2024-11-05T08:50:00-06:00"
recorded: "2024-11-05T11:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 141/93, pulse 72, wt 177 lb.
Labs 11/1: eGFR 40, K 5, UACR 398 mg/g, A1c 6.6%, LDL 134 mg/dL.
Dapagliflozin started 10 mg daily today (CKD + DM, cardiorenal benefit).
Recheck BMP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-110522",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-110522",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-110522",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
