---
folio: "0.1"
id: "01GCSASXZ090J493EZ629K8MB5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00492858"
effective: "2022-09-12T09:15:00-05:00"
recorded: "2022-09-12T12:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new complaints.
BP 139/82, pulse 66, wt 187 lb.
Labs 9/10: eGFR 81, K 4.8, UACR 8 mg/g, A1c 7.6%.
Reviewed results with pt. Diet and activity discussed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-091296",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-091296",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-091296",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-091296",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
