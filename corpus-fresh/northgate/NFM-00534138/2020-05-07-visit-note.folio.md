---
folio: "0.1"
id: "01E7RAFJ70KXFWHA3Q6ZC2ATVG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00534138"
effective: "2020-05-07T12:20:00-05:00"
recorded: "2020-05-07T14:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 146/86, pulse 66, wt 191 lb.
Labs 5/2: eGFR 62, K 4.4, UACR 88 mg/g, LDL 75 mg/dL.
BP above goal today. Will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-050753",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-050753",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
