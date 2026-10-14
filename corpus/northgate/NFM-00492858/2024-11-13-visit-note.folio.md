---
folio: "0.1"
id: "01JCK90VN0PZJF4176RR8TZFPE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00492858"
effective: "2024-11-13T09:40:00-06:00"
recorded: "2024-11-13T11:27:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Patient ran out of losartan about 3 weeks ago and has not been taking it.
BP 148/89, repeat 146/89, pulse 78, wt 186 lb.
Labs 11/9: eGFR 81, K 4.8, UACR 9 mg/g, A1c 7.1%.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111353",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111353",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
