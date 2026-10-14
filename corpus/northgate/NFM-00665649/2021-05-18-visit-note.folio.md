---
folio: "0.1"
id: "01F60YP7D0QABP56884VWWDV36"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2021-05-18T14:50:00-05:00"
recorded: "2021-05-18T18:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 128/86, pulse 80, wt 197 lb.
Today: eGFR 68, K 4.3, A1c 8.1%.
A1c up. Insulin glargine started, 10 units at bedtime today. Reviewed pen technique and low sugar signs.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-051815",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-051815",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-051815",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
