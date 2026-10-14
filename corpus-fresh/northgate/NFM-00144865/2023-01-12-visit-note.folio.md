---
folio: "0.1"
id: "01GPKFGYB0TTW4MNYDE03PF24P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00144865"
effective: "2023-01-12T08:45:00-06:00"
recorded: "2023-01-12T11:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 147/92, repeat 141/89, pulse 69, wt 207 lb.
Today eGFR 47, K 4.6, UACR 166 mg/g, A1c 6.9%. CKD stage 3a added to the problem list.
BP above goal: chlorthalidone started 12.5 mg daily today.
Discussed home BP checks.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011227",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011227",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-011227",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-011227",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
