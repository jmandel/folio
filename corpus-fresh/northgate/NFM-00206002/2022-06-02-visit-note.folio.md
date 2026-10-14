---
folio: "0.1"
id: "01G4KN1QD0VXXARZJBE2Z3FSFZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00206002"
effective: "2022-06-02T15:45:00-05:00"
recorded: "2022-06-02T21:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 111/64, pulse 77, wt 143 lb.

Labs today: eGFR 77, K 4.9, UACR 10 mg/g, A1c 7.2%, LDL 104 mg/dL.

Records requested from prior office. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-060259",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-060259",
    "rank": 1,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
