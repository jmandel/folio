---
folio: "0.1"
id: "01JKC8QB708JQ51BJQS0RCV1JB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2025-02-05T13:50:00-06:00"
recorded: "2025-02-05T17:57:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 135/84, pulse 72, wt 222 lb.
1/31 labs: A1c 7.4%, eGFR 39, K 4.7.
Pt feels well, no new concerns. Health maintenance reviewed.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-020537",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-020537",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-020537",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
