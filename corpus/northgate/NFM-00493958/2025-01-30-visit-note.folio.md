---
folio: "0.1"
id: "01JJWP76F0EV9X3QQTXMEY9ZEN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2025-01-30T12:15:00-06:00"
recorded: "2025-01-30T16:45:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM follow-up. No new complaints.
BP 122/71, pulse 64, wt 186 lb.
Labs 1/26: eGFR 44, K 4.9, A1c 7.5%.
eGFR 44, so metformin changed to 500 mg twice daily today.
Referral to nephrology placed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-013054",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-013054",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-013054",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-013054",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
