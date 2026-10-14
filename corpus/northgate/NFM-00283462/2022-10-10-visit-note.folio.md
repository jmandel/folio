---
folio: "0.1"
id: "01GF1BBN802H05AJZQBAQA7D44"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283462"
effective: "2022-10-10T08:40:00-05:00"
recorded: "2022-10-10T11:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 145/93, pulse 81, wt 197 lb. Above goal.

Lisinopril dose changed to 40 mg daily today.

Labs today: eGFR 55, K 4.6, LDL 97 mg/dL. CKD stage 3a on problem list.

RTC 3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-101031",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-101031",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-101031",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
