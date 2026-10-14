---
folio: "0.1"
id: "01HE6QYTX011T9N3EP20WCG1K2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00382868"
effective: "2023-11-01T14:50:00-05:00"
recorded: "2023-11-01T19:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 124/72, pulse 66, wt 203 lb.
Labs 10/29: eGFR 80, UACR 192 mg/g, A1c 6.5%, LDL 77 mg/dL.
Reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-110141",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-110141",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-110141",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
