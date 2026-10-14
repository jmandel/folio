---
folio: "0.1"
id: "01FY7D3AX0EMB5P0AV45NTQTW9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701178"
effective: "2022-03-15T08:50:00-05:00"
recorded: "2022-03-15T13:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing OK, no new complaints.
BP 142/85, repeat 140/85, pulse 78, wt 234 lb.
Today: eGFR 71, K 4.3, A1c 8.1%, LDL 99 mg/dL.
Metformin dose changed to 1000 mg twice daily today (A1c 8.1).
Recheck A1c in 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-031586",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-031586",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-031586",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-031586",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
