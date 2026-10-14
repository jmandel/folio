---
folio: "0.1"
id: "01JBYRZTA09E6438GX5WC28MJQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531772"
effective: "2024-11-05T08:30:00-06:00"
recorded: "2024-11-05T12:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-110563",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-110563",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-110563",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
