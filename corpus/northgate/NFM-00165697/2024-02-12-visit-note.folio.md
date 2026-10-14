---
folio: "0.1"
id: "01HPG1ZQZ06AB5N7C2FW2CCN3B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2024-02-12T13:40:00-06:00"
recorded: "2024-02-12T19:41:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 117/76, pulse 73, wt 213 lb.
Labs 2/6: eGFR 60, K 3.8, A1c 8.4%.
Metformin dose changed to 1000 mg twice daily today for A1c 8.4.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-021292",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-021292",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-021292",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
