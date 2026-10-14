---
folio: "0.1"
id: "01FARCB8H09X3XZ8CHEF80KC66"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363440"
effective: "2021-07-16T10:15:00-05:00"
recorded: "2021-07-16T14:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 143/86, repeat 135/82. Pulse 77, wt 174 lb.
Labs 7/10: eGFR 94, K 4.4.
BP above goal, chlorthalidone started 12.5 mg daily today.
Recheck BP and BMP in a few weeks.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-071673",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-071673",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-071673",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-071673",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
