---
folio: "0.1"
id: "01FW7KJZ30BPY6CMDNYD8NCT06"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00236387"
effective: "2022-02-18T11:20:00-06:00"
recorded: "2022-02-18T17:45:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 147/88, pulse 87, wt 187 lb.
Labs 2/12: eGFR 78, K 4.3, A1c 7%.
BP above goal. Amlodipine started 5 mg daily today.
Pt will watch for ankle swelling. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-021833",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-021833",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-021833",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
