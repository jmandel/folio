---
folio: "0.1"
id: "01J5EA7EY08SAP0W5FT79MS565"
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
Annual exam. BP 143/86, repeat 140/83. Pulse 70, wt 195 lb.
Labs today: eGFR 60, K 4.5, UACR 425 mg/g, A1c 6.9%.
eGFR drifting down and UACR higher than before. Will follow closely.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-081672",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-081672",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-081672",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
