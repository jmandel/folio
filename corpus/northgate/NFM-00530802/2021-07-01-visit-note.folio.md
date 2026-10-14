---
folio: "0.1"
id: "01F9HQRB00EQC4XR5V166S0S36"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00530802"
effective: "2021-07-01T08:00:00-05:00"
recorded: "2021-07-01T14:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 150/90, repeat 144/89, pulse 80, wt 207 lb.
Labs 6/28: eGFR 100, K 4.2, UACR 210 mg/g, A1c 8.3%, LDL 100.
A1c 8.3, so dapagliflozin started 10 mg daily today.
BP above goal, lisinopril dose changed to 40 mg daily today.
Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-070194",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-070194",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-070194",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
