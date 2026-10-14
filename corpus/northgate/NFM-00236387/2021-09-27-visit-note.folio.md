---
folio: "0.1"
id: "01FGMZSDG0THE08K7NY0DEC9HS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00236387"
effective: "2021-09-27T14:15:00-05:00"
recorded: "2021-09-27T20:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

chlorthalidone: started 12.5 mg daily today (BP above goal)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092777",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092777",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-092777",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
