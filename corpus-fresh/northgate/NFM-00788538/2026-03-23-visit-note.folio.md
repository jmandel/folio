---
folio: "0.1"
id: "01KME099J0Q4FENPW9JCSWV067"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00788538"
effective: "2026-03-23T10:40:00-05:00"
recorded: "2026-03-23T13:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 145/80, repeat 143/77, pulse 83, wt 176 lb.
Today's labs: eGFR 82, K 4, UACR 228 mg/g, A1c 7.6%, LDL 120 mg/dL.
Reviewed results with pt. Home BP log to bring next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-032395",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-032395",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
