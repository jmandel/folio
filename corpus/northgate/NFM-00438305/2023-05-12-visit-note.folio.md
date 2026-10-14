---
folio: "0.1"
id: "01H09258W0XNGRJEWZ3YW400SF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00438305"
effective: "2023-05-12T14:15:00-05:00"
recorded: "2023-05-12T17:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints today.

BP 125/75, pulse 85, wt 214 lb.

Wt steady, BP ok. Routine screening reviewed.

RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051292",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051292",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-051292",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-051292",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
