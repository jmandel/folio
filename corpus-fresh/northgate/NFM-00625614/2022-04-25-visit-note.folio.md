---
folio: "0.1"
id: "01G1HH8350GHZCGJHNDP531G4Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625614"
effective: "2022-04-25T15:10:00-05:00"
recorded: "2022-04-25T18:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 150/86, pulse 74, wt 172 lb.
Labs today: eGFR 61, K 4.4, UACR 22 mg/g, A1c 6.9%, LDL 112.
BP above goal. Losartan dose changed to 100 mg daily today (BP above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-042575",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-042575",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-042575",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
