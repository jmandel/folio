---
folio: "0.1"
id: "01GCCKX9T0QDMEPD4J92JWBQC0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00819371"
effective: "2022-09-07T12:00:00-05:00"
recorded: "2022-09-07T13:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Pt feels well, no complaints.

BP 137/79, pulse 64, wt 189 lb.

eGFR 95, K 4.3, LDL 139 mg/dL today.

Reviewed labs with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-090759",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-090759",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
