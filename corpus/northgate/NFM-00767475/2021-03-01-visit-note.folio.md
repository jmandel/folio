---
folio: "0.1"
id: "01EZQMT3109ES09V0EYNENZ9EZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00767475"
effective: "2021-03-01T08:20:00-06:00"
recorded: "2021-03-01T13:39:00-06:00"
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
BP 114/70, pulse 67, wt 194 lb.
Labs 2/27: eGFR 66, K 4.8, LDL 124 mg/dL.
Results reviewed with pt. RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-030126",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-030126",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-030126",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
