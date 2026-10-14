---
folio: "0.1"
id: "01J18ERHD0KNGB0P23T8BR8G4S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00457036"
effective: "2024-06-25T08:50:00-05:00"
recorded: "2024-06-25T14:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.

BP 141/83, repeat 139/80, pulse 79, wt 258 lb.
Labs today: eGFR 62, K 4.1, UACR 8 mg/g, A1c 7.1%.

Results reviewed with pt. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062528",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062528",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
