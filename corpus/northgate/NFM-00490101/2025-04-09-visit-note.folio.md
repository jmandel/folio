---
folio: "0.1"
id: "01JRE309T0GWPV4E9BDRW4XAYK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490101"
effective: "2025-04-09T10:45:00-05:00"
recorded: "2025-04-09T15:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 138/83, pulse 64, wt 224 lb.
Labs from 4/5: eGFR 42, K 5, UACR 11 mg/g.
CKD stage 3b on the problem list. Reviewed results with pt.
RTC for recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-040964",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-040964",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-040964",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
