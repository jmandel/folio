---
folio: "0.1"
id: "01HRSWQN3006T0994RRKMF916J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2024-03-12T09:10:00-05:00"
recorded: "2024-03-12T12:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 144/84, repeat 139/81. Pulse 85, wt 194 lb.
Labs 3/8: eGFR 64, K 4.8, A1c 6.8%.
BP a little high in office, will recheck next visit.
Routine health maintenance discussed. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031228",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031228",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-031228",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-031228",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
