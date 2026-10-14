---
folio: "0.1"
id: "01DTT3RJ60BKGWPF6F0NT8NKJJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084740"
effective: "2019-11-28T14:50:00-06:00"
recorded: "2019-11-28T16:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 147/94, repeat 144/90. Pulse 86, wt 193 lb.
Labs today: eGFR 69, K 4.5, A1c 8.8%, LDL 96.
A1c 8.8 today, started insulin glargine 10 units at bedtime. Reviewed injection technique.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-112847",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-112847",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-112847",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
