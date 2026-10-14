---
folio: "0.1"
id: "01JB9YHGX0EM5254057MKRN78R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2024-10-28T08:30:00-05:00"
recorded: "2024-10-28T11:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 124/76, pulse 76, wt 203 lb.
Today: eGFR 61, K 4.3, UACR 757 mg/g, A1c 6.5%, LDL 98 mg/dL.
UACR much higher than before and eGFR lower. Discussed with pt.
RTC 3 mo, repeat labs then.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102812",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-102812",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-102812",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
