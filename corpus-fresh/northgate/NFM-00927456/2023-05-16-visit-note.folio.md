---
folio: "0.1"
id: "01H0KMG9Q0ZA5GS6TJ1W4NSMVV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927456"
effective: "2023-05-16T15:15:00-05:00"
recorded: "2023-05-16T20:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 153/91, repeat 146/90, pulse 65, wt 166 lb.
eGFR 59, K 4.6, A1c 6.8% today.
BP above goal, chlorthalidone started 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051643",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051643",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
