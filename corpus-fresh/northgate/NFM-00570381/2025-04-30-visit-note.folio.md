---
folio: "0.1"
id: "01JT4RVS901HFH0TMSMZW0H0ZG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2025-04-30T14:45:00-05:00"
recorded: "2025-04-30T20:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK.
BP 131/82, pulse 83, wt 222 lb.
Labs today: eGFR 88, K 4.3, UACR 438 mg/g, A1c 7.7%.
Empagliflozin: started 10 mg daily today (A1c above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-043037",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-043037",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-043037",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
