---
folio: "0.1"
id: "01G9ZBF8F06JM8DRW2Q59G1SF2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00562483"
effective: "2022-08-08T10:10:00-05:00"
recorded: "2022-08-08T13:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 137/81, pulse 65, wt 162 lb.
eGFR 74, K 4.5 today.
Labs stable, reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-080813",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-080813",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
