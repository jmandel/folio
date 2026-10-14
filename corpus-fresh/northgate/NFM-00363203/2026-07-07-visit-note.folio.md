---
folio: "0.1"
id: "01KWZHMQ20CZRN2DRDDZH5XKG5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2026-07-07T13:45:00-05:00"
recorded: "2026-07-07T19:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 143/85, repeat 141/81. Pulse 66, wt 187 lb.
Today: eGFR 68, K 4.8, UACR 524 mg/g, A1c 8.5%, LDL 86 mg/dL.
Metformin: dose changed to 1000 mg twice daily today (A1c 8.5).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-070719",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-070719",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-070719",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
