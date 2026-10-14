---
folio: "0.1"
id: "01JY05H6S0R6GPKW1DHC5MH4JA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212600"
effective: "2025-06-17T13:45:00-05:00"
recorded: "2025-06-17T19:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feeling well.
BP 122/72, pulse 81, wt 237 lb.
Labs 6/12: eGFR 86, K 4, UACR 337 mg/g, A1c 8.4%, LDL 131 mg/dL.
A1c 8.4, so empagliflozin started 10 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061792",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-061792",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
