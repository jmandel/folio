---
folio: "0.1"
id: "01GGXA9X80QG734AQZ6B5384ZK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00016041"
effective: "2022-11-02T14:30:00-05:00"
recorded: "2022-11-02T18:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing well, no new complaints.
BP 133/80, pulse 76, wt 188 lb.
Labs 10/30: eGFR 80, K 4.5, UACR 6 mg/g, A1c 6.5%, LDL 134 mg/dL.
Went over results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-110248",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-110248",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
