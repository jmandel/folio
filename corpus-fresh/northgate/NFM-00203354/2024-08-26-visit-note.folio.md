---
folio: "0.1"
id: "01J685417016PMX8ZVY35JCV6N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00203354"
effective: "2024-08-26T11:10:00-05:00"
recorded: "2024-08-26T15:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt feels well, no new complaints.

BP 141/88, pulse 84, wt 195 lb.

Today: eGFR 98, K 4.3, UACR 52 mg/g, A1c 7.7%, LDL 141 mg/dL.

Labs reviewed with pt. F/u in 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082649",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082649",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-082649",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
