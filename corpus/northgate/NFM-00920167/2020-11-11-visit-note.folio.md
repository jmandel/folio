---
folio: "0.1"
id: "01EPW7DR80D6758ZAGF4D1X8XQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00920167"
effective: "2020-11-11T09:20:00-06:00"
recorded: "2020-11-11T12:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 148/86, pulse 66, wt 133 lb.
Labs today: eGFR 70, K 4.3, UACR 236 mg/g, A1c 6.7%, LDL 42.
BP above goal today, will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-111144",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-111144",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
