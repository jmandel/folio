---
folio: "0.1"
id: "01HY1VX8S03AJP9X5CYMAH95BH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00128158"
effective: "2024-05-16T12:40:00-05:00"
recorded: "2024-05-16T18:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 127/78, pulse 68, wt 198 lb.
Labs 5/13: A1c 7.4%, eGFR 65, K 4.1, UACR 12 mg/g.
Stable. Pt feeling well, no new complaints.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051696",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051696",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-051696",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
