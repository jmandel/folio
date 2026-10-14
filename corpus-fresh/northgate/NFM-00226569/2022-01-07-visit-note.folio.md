---
folio: "0.1"
id: "01FRVNBP60KBPGY2SZEF8VQT72"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2022-01-07T15:00:00-06:00"
recorded: "2022-01-07T19:38:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 121/68, pulse 82, wt 174 lb.

Labs today: eGFR 45, K 4.7, UACR 60 mg/g, A1c 7.3%.

eGFR 45, so metformin dose changed to 500 mg twice daily today. Pt agrees.

RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-010732",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-010732",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-010732",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
