---
folio: "0.1"
id: "01M2P7P2Q0R1VHE1GGWTTVY5J3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2026-09-16T12:00:00-05:00"
recorded: "2026-09-16T18:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 133/82, pulse 84, wt 163 lb.
Labs 9/13: eGFR 40, K 5, A1c 7.9%, LDL 80.
Metformin dose changed to 500 mg twice daily today (eGFR 41).
K at upper end, recheck at next draw.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-091644",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-091644",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-091644",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
