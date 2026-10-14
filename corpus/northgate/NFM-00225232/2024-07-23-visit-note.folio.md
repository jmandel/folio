---
folio: "0.1"
id: "01J3GN1C20Q170KGK8PMBH3XKN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00225232"
effective: "2024-07-23T12:30:00-05:00"
recorded: "2024-07-23T15:38:00-05:00"
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
BP 143/87, repeat 137/84, pulse 69, wt 180 lb.
Labs 7/18: eGFR 92, K 5.1, UACR 183 mg/g, A1c 8%, LDL 165 mg/dL.
K and A1c up from last time, discussed diet with pt.
RTC 3 mo, repeat labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-072365",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-072365",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-072365",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-072365",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
