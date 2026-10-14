---
folio: "0.1"
id: "01DPS5WBV0EPR25XD69X938CDR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00018491"
effective: "2019-10-09T09:50:00-05:00"
recorded: "2019-10-09T16:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 154/89, repeat 148/85, pulse 88, wt 191 lb.
eGFR 95, K 4.4 today.
BP above goal, losartan dose changed to 100 mg daily today.
Pt agrees. Recheck BP in 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-100996",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-100996",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
