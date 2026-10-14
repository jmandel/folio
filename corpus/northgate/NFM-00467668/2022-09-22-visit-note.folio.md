---
folio: "0.1"
id: "01GDKKC45069NPHM9BQJ3V787V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00467668"
effective: "2022-09-22T14:30:00-05:00"
recorded: "2022-09-22T16:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of DM2, HLD and obesity per pt.
BP 116/66, pulse 66, wt 220 lb.
Labs today: eGFR 42, K 4.1, UACR 59 mg/g, A1c 7%, LDL 81.
Metformin dose changed to 500 mg twice daily today (eGFR 42).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-092214",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-092214",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-092214",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
