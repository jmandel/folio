---
folio: "0.1"
id: "01JKY9M1D09S2GGKZ1QX91C4YG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00025136"
effective: "2025-02-12T15:30:00-06:00"
recorded: "2025-02-12T17:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Pt feels well, no complaints.
BP 138/78, pulse 62, wt 205 lb.
Labs 2/8: eGFR 66, K 4.3.
BP improved vs last visits. Discussed home BP log.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021242",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-021242",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
