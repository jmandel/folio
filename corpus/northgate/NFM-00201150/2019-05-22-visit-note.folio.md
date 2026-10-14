---
folio: "0.1"
id: "01DBG968F05ZW5HT7QG7MMFZMP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2019-05-22T08:00:00-05:00"
recorded: "2019-05-22T12:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 139/86, pulse 84, wt 177 lb.
Labs 5/18: eGFR 68, K 4.5, UACR 47 mg/g, A1c 7.4%, LDL 116 mg/dL.
Reviewed results with pt. Records requested from prior office.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-052212",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-052212",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
