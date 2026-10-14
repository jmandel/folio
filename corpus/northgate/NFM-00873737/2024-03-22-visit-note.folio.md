---
folio: "0.1"
id: "01HSKE9RK0878V9EWS2C1JETDZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2024-03-22T08:50:00-05:00"
recorded: "2024-03-22T11:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints.
BP 128/81, pulse 88, wt 188 lb.
Labs 3/19: eGFR 58, K 4.1, A1c 6.7%, LDL 117 mg/dL.
Reviewed with pt, no changes today.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-032232",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-032232",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-032232",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
