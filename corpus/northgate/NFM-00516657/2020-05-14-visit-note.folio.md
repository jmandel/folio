---
folio: "0.1"
id: "01E8AHEBB0MFT4J2E2G79APBZJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00516657"
effective: "2020-05-14T11:45:00-05:00"
recorded: "2020-05-14T16:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 144/95, repeat 139/93. Pulse 79, wt 182 lb.
Labs today: eGFR 99, K 4.7, LDL 117 mg/dL.
Discussed BP and lipids, will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-051412",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-051412",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
