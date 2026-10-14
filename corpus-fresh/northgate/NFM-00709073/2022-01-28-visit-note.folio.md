---
folio: "0.1"
id: "01FTHKJYE0071CP2T0KHFSHXY3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00709073"
effective: "2022-01-28T12:30:00-06:00"
recorded: "2022-01-28T18:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 134/80, pulse 82, wt 232 lb.
Labs today: eGFR 78, K 4.5, UACR 153 mg/g, A1c 8.4%, LDL 113.
A1c 8.4 today, dapagliflozin started 10 mg daily.
Discussed diet and activity. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-012886",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-012886",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-012886",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
