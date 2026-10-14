---
folio: "0.1"
id: "01HXJF47D0CN9DC2XQGYEB9WT6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2024-05-10T13:00:00-05:00"
recorded: "2024-05-10T18:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 158/94, repeat 155/94, pulse 87, wt 210 lb.
Labs today: eGFR 38, K 4.8, UACR 81 mg/g, A1c 8.3%, LDL 148.
Dapagliflozin started 10 mg daily today (A1c 8.3, CKD).
BP above goal, lisinopril changed to 40 mg daily today.
Recheck BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051069",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051069",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-051069",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
