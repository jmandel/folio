---
folio: "0.1"
id: "01GPEMSRV0CB43ZE6KVBEEQZ1K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00892695"
effective: "2023-01-10T08:00:00-06:00"
recorded: "2023-01-10T14:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 128/72, pulse 65, wt 152 lb.
Today: eGFR 90, K 4.4, A1c 7.6%.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011063",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011063",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
