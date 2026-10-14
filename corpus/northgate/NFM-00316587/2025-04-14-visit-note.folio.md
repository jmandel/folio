---
folio: "0.1"
id: "01JRV66KM0DB94P0D5REHP97QK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00316587"
effective: "2025-04-14T13:00:00-05:00"
recorded: "2025-04-14T17:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 127/78, pulse 64, wt 184 lb.
Labs 4/9: A1c 8.2%, eGFR 36, K 4.3. CKD stage 3b.
Dapagliflozin started 10 mg daily today (A1c 8.2, CKD).
Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041444",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-041444",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-041444",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
