---
folio: "0.1"
id: "01JARAVSW00PP2TM0EYTMXGB9Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00245775"
effective: "2024-10-21T10:20:00-05:00"
recorded: "2024-10-21T15:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

metformin: dose changed to 500 mg twice daily today (eGFR 44)

dulaglutide: started 0.5 mg weekly today (A1c 8.4)

empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102172",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-102172",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-102172",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
