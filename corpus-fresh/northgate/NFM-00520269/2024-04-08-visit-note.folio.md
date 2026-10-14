---
folio: "0.1"
id: "01HTZ88E20C6Z7ZQ64A7KCW1EJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2024-04-08T08:10:00-05:00"
recorded: "2024-04-08T11:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing well, no new symptoms.
BP 124/73, pulse 79, wt 255 lb.
Labs today: eGFR 42, K 4.4, UACR 606 mg/g, A1c 7.7%, LDL 73 mg/dL.
Kidney function stable. Continue to monitor.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040819",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040819",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
