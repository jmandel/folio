---
folio: "0.1"
id: "01ECJKB9S08CYGJNDN2QQ0TJES"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00112059"
effective: "2020-07-06T09:10:00-05:00"
recorded: "2020-07-06T12:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 125/78, pulse 69, wt 216 lb.
Labs today: eGFR 66, K 4.3, LDL 116 mg/dL.
Problem list built from pt's history.
RTC to recheck BP, sooner if concerns.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-070616",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-070616",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
