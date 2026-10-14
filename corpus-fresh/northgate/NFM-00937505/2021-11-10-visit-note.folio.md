---
folio: "0.1"
id: "01FM5QPX708SN21P4ZP4KHXQYB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937505"
effective: "2021-11-10T10:45:00-06:00"
recorded: "2021-11-10T14:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no complaints.
BP 125/75, pulse 63, wt 185 lb.
Labs today: eGFR 63, K 4.5, A1c 6.6%.
Exam unremarkable. Wt down a bit from last visit.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-111027",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-111027",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-111027",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
