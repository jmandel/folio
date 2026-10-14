---
folio: "0.1"
id: "01E0ZTZ8P0QX9TCERGWP9WZFW7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2020-02-13T09:30:00-06:00"
recorded: "2020-02-13T11:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History per pt.
BP 143/83, repeat 139/81. Pulse 71, wt 243 lb.
Labs 2/8: eGFR 90, K 4.2, UACR 645 mg/g, A1c 7.1%, LDL 124 mg/dL.
Reviewed problem list with pt.
RTC to review BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-021382",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-021382",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
