---
folio: "0.1"
id: "01FHV64D60A56G7ANS2AXABE44"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226578"
effective: "2021-10-12T12:30:00-05:00"
recorded: "2021-10-12T16:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 152/89, pulse 86, wt 252 lb.
Today: eGFR 62, K 4.9, A1c 7.7%.
BP above goal. Lisinopril dose changed to 40 mg daily today.
Will watch K at next labs.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-101276",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-101276",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
