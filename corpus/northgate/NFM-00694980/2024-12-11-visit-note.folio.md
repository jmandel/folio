---
folio: "0.1"
id: "01JEVZ6QC0H7RH9N2T5AK2MBJZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00694980"
effective: "2024-12-11T10:50:00-06:00"
recorded: "2024-12-11T17:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.
BP 155/92, repeat 148/90. Pulse 66, wt 205 lb.
Labs 12/7: eGFR 78, K 4.8.
BP above goal, lisinopril changed to 20 mg daily today.
RTC to recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-121118",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-121118",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-121118",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
