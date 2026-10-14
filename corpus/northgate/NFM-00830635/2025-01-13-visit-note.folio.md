---
folio: "0.1"
id: "01JHGGJZW03CF3HK7NXTDW73RP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00830635"
effective: "2025-01-13T09:45:00-06:00"
recorded: "2025-01-13T13:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 149/87, repeat 145/84, pulse 78, wt 254 lb.
1/7 labs: eGFR 72, K 4.9.
BP above goal on both readings. Will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-011313",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011313",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
