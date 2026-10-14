---
folio: "0.1"
id: "01HFZ0CZ80SGX5QX315M3R6E9W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00050191"
effective: "2023-11-23T10:00:00-06:00"
recorded: "2023-11-23T15:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Feels well, no complaints today.
BP 132/88, pulse 67, wt 158 lb.
Labs today: eGFR 42, K 4.5, UACR 166 mg/g, LDL 68 mg/dL.
Will review results with pt and repeat at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-112367",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-112367",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
