---
folio: "0.1"
id: "01E5TQT1F09ND691W5HC3AEMY9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00206105"
effective: "2020-04-13T11:20:00-05:00"
recorded: "2020-04-13T16:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new complaints.

BP 144/82, repeat 142/80, pulse 62, wt 169 lb.
Labs today: eGFR 98, K 4.6, UACR 43 mg/g, A1c 7.3%.

BP a bit above goal, recheck at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-041396",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-041396",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-041396",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
