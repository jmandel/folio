---
folio: "0.1"
id: "01G4ZJWBG0WYTH40MXJ14ZG72W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531163"
effective: "2022-06-07T08:40:00-05:00"
recorded: "2022-06-07T12:20:00-05:00"
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

BP 146/86, pulse 67, wt 178 lb.
Labs today: eGFR 76, K 4.2, A1c 6.3%.

Will recheck BP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-060721",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-060721",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
