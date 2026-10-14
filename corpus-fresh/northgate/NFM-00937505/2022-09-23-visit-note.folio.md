---
folio: "0.1"
id: "01GDNQBDH099J5Y2VJSD8XM3K9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937505"
effective: "2022-09-23T10:00:00-05:00"
recorded: "2022-09-23T12:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well per pt.
BP 129/78, pulse 78, wt 191 lb.
Labs today: eGFR 59, K 3.9, UACR 19 mg/g, A1c 6.7%, LDL 82 mg/dL.
eGFR a bit lower than before, will keep watching.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-092396",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
