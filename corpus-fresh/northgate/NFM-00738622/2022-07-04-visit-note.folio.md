---
folio: "0.1"
id: "01G75HR150Q80CT2VXWJT9DZ78"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2022-07-04T12:50:00-05:00"
recorded: "2022-07-04T16:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No hypoglycemia symptoms reported.
BP 137/83, pulse 79, wt 212 lb.
A1c 7.5%, eGFR 66, K 4.2, LDL 136 mg/dL. UACR 892 mg/g today, up from last.
Discussed diet and adherence. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-070436",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-070436",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
