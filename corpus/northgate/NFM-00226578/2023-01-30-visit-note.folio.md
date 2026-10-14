---
folio: "0.1"
id: "01GR2C4BE0NWRFPC0BW09F82K8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226578"
effective: "2023-01-30T14:00:00-06:00"
recorded: "2023-01-30T16:18:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 142/86, repeat 136/86. Pulse 63, wt 255 lb.
Today: eGFR 58, K 4.5, UACR 147 mg/g, A1c 7.4%.
BP above goal. Amlodipine started 5 mg daily today.
Pt to report any ankle swelling.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-013021",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-013021",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-013021",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
