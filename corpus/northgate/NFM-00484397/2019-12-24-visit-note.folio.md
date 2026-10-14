---
folio: "0.1"
id: "01DWX6AR40YKQXVF70FZ1TF7PN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2019-12-24T12:15:00-06:00"
recorded: "2019-12-24T18:12:00-06:00"
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
BP 132/78, pulse 66, wt 163 lb.
Labs 12/22: eGFR 83, K 4.5.
Reviewed diet and exercise.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-122417",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-122417",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-122417",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
