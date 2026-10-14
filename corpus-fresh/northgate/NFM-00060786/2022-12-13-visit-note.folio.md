---
folio: "0.1"
id: "01GM6KG7V0G1GCNMF0DTQ33A8X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00060786"
effective: "2022-12-13T11:50:00-06:00"
recorded: "2022-12-13T14:41:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well, no new complaints.

BP 131/77, pulse 64, wt 177 lb.

12/7 labs: eGFR 85. K 5.9 on first draw but sample hemolyzed; repeat K 4.8.

Hemolyzed value not real. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-121314",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-121314",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-121314",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
