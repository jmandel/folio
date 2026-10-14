---
folio: "0.1"
id: "01J5EA7EY0A14HCW1S59W8Y99F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2024-08-16T09:10:00-05:00"
recorded: "2024-08-16T14:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 143/86, repeat 140/83, pulse 70, wt 195 lb.
Labs today: eGFR 60, K 4.5, UACR 425 mg/g, A1c 6.7%, LDL 78.
UACR higher than before, eGFR down a little. Will repeat in a few months.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-081662",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-081662",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-081662",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
