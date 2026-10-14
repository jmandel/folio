---
folio: "0.1"
id: "01KRC4NQ90KNRGFBM2ZS4VX7FW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00089203"
effective: "2026-05-11T11:30:00-05:00"
recorded: "2026-05-11T13:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 144/86, repeat 141/83. Pulse 79, wt 199 lb.
eGFR 53 today, K 4.5. UACR 661 mg/g.
BP still above goal. Reviewed results with pt.
RTC 2 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-051143",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-051143",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-051143",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-051143",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
