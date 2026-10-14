---
folio: "0.1"
id: "01K7FHG3T0BHPTX6X8A5CHHJ3R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2025-10-13T09:00:00-05:00"
recorded: "2025-10-13T14:42:00-05:00"
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
BP 133/84, pulse 74, wt 176 lb.
Labs today: eGFR 77, K 4.2, A1c 7.3%.
Results reviewed with pt, no changes today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-101387",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-101387",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-101387",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
