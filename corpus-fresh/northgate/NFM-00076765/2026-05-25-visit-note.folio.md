---
folio: "0.1"
id: "01KSG4PB80R1AZBY7XZ6GWDEB5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2026-05-25T08:15:00-05:00"
recorded: "2026-05-25T13:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels okay, no new complaints.
BP 123/73, pulse 88, wt 155 lb.
Labs 5/21: eGFR 40, K 4.6, UACR 1097 mg/g, A1c 9.2%.
A1c and UACR both higher. Reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-052575",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-052575",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-052575",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
