---
folio: "0.1"
id: "01KRYGAN309ZQXSXSYP6NMG4QR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2026-05-18T15:00:00-05:00"
recorded: "2026-05-18T16:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 136/81, pulse 74, wt 179 lb.
Labs 5/15: A1c 7.3%, eGFR 43, K 4.4, LDL 79.
Metformin dose changed to 500 mg twice daily today for eGFR 44.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-051813",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-051813",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
