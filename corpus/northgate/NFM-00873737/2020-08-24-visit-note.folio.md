---
folio: "0.1"
id: "01EGHCAX80R1XYERG5BQ52F5EC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2020-08-24T13:00:00-05:00"
recorded: "2020-08-24T18:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, records to follow.
BP 139/85, pulse 66, wt 191 lb.
Labs 8/18: eGFR 64, K 4.3, UACR 571 mg/g, A1c 7.5%, LDL 138 mg/dL.
Reviewed results with pt. Problem list built from pt history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-082472",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-082472",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
