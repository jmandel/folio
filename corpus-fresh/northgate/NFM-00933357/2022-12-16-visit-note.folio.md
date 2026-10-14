---
folio: "0.1"
id: "01GMES0590MH8AJWG4W51KDKRC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00933357"
effective: "2022-12-16T15:30:00-06:00"
recorded: "2022-12-16T18:51:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new symptoms.
BP 149/91, pulse 85, wt 220 lb.
Today eGFR 94, K 4.5, A1c 7.4%, LDL 119.
BP above goal, amlodipine started 5 mg daily today.
Recheck BP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-121622",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-121622",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-121622",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
