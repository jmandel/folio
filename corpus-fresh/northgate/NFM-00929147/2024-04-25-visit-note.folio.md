---
folio: "0.1"
id: "01HWB4QNN0VC4NPH3GRTR87HJK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00929147"
effective: "2024-04-25T09:10:00-05:00"
recorded: "2024-04-25T12:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN, DM2 and CKD per pt.
BP 144/87, pulse 83, wt 158 lb.
Labs 4/22: eGFR 48, K 4.1, UACR 218 mg/g, A1c 6.9%, LDL 138 mg/dL.
Reviewed results with pt and went over home BP checks.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-042593",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-042593",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
