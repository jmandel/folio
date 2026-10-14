---
folio: "0.1"
id: "01KDNZN2D0ZYN6M4935ANF08Y7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00539751"
effective: "2025-12-29T13:10:00-06:00"
recorded: "2025-12-29T15:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Dry cough on lisinopril, no swelling.

BP 150/86, repeat 147/85, pulse 73, wt 162 lb.

Labs today: eGFR 64, K 4.3, A1c 7.9%, LDL 102 mg/dL.

Lisinopril stopped today (dry cough). Losartan started 50 mg daily today for ACE inhibitor cough. Lisinopril intolerance: dry cough, added to allergy list.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-122943",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-122943",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
