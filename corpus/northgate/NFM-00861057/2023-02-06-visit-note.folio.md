---
folio: "0.1"
id: "01GRMG7JW0M8PFJBN805N7J7AV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861057"
effective: "2023-02-06T15:10:00-06:00"
recorded: "2023-02-06T17:16:00-06:00"
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
BP 143/84, repeat 140/82. Pulse 78, wt 164 lb.
eGFR 71 and K 4.2 today.
BP above goal, chlorthalidone started 12.5 mg daily today.
RTC for BP check and BMP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020644",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-020644",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
