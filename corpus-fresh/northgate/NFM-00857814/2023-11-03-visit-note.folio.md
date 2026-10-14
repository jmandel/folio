---
folio: "0.1"
id: "01HEB9W0Z04J3SDMAJM4JREWTD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00857814"
effective: "2023-11-03T09:50:00-05:00"
recorded: "2023-11-03T14:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Pt doing well, no new complaints.
BP 127/74, pulse 65, wt 202 lb.
Labs today: eGFR 62, K 4.5, UACR 194 mg/g.
Will call if anything changes. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-110349",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-110349",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-110349",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
