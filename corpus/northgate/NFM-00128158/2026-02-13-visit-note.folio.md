---
folio: "0.1"
id: "01KHC3T1A0G6JSAGPSQ5GA9P2C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00128158"
effective: "2026-02-13T08:45:00-06:00"
recorded: "2026-02-13T12:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 134/74, pulse 63, wt 201 lb.
Labs 2/11: A1c 7.7%, eGFR 63, K 4.9, LDL 77 mg/dL.
Pt feels well. K a bit higher than before, will keep an eye on it.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021367",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021367",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
