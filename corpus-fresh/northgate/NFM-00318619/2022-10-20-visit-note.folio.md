---
folio: "0.1"
id: "01GFVZKCJ0EA8YD5PKFB6S8PDV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00318619"
effective: "2022-10-20T13:30:00-05:00"
recorded: "2022-10-20T19:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 133/81, pulse 66, wt 220 lb.
Labs today: eGFR 50, K 4.9, UACR 224 mg/g, A1c 7.7%, LDL 114 mg/dL.
Reviewed results with pt. Will recheck labs at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-102021",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-102021",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
