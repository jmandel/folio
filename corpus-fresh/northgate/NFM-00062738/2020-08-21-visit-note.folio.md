---
folio: "0.1"
id: "01EG8V7990PNPB3ES97CNXDKRZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00062738"
effective: "2020-08-21T08:00:00-05:00"
recorded: "2020-08-21T10:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 149/88, repeat 144/86, pulse 76, wt 140 lb. Still above goal.
eGFR 63, K 4.5, UACR 64 mg/g, A1c 6.6% today.
Lisinopril dose changed to 40 mg daily today for BP above goal.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-082165",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-082165",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-082165",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
