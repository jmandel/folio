---
folio: "0.1"
id: "01JDJBGK10G03HHRNV9DPE2AKR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00845659"
effective: "2024-11-25T09:20:00-06:00"
recorded: "2024-11-25T13:07:00-06:00"
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

BP 116/66, pulse 86, wt 188 lb.
Labs 11/22: eGFR 94, K 4.4, A1c 7.6%, UACR 390 mg/g.

Reviewed results with pt, UACR to be followed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112563",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-112563",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-112563",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
