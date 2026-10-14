---
folio: "0.1"
id: "01G8VGFRR0Q83ZSG70KQTXEC8Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2022-07-25T13:20:00-05:00"
recorded: "2022-07-25T15:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 123/78, pulse 81, wt 153 lb.
Labs 7/19: eGFR 49, K 4.2, UACR 10 mg/g, A1c 6.5%, LDL 134.
Reviewed results with pt, feels well.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-072542",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-072542",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-072542",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
