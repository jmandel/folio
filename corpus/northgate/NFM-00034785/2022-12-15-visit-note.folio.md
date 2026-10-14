---
folio: "0.1"
id: "01GMBY4ED06HV9YF1SPJ5E7ETY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034785"
effective: "2022-12-15T12:30:00-06:00"
recorded: "2022-12-15T16:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 136/80, pulse 78, wt 207 lb.
Labs 12/10: eGFR 78, K 4.2, LDL 107 mg/dL.
BP better. Pt doing well, no complaints.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-121532",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-121532",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
