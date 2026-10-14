---
folio: "0.1"
id: "01JMXDN6T0QE7PPAT8A48DZCW8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00238950"
effective: "2025-02-24T15:10:00-06:00"
recorded: "2025-02-24T20:06:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 142/84, pulse 77, wt 216 lb.
eGFR 87, K 4.9, UACR 418 mg/g, A1c 7.7% today.
Lisinopril: dose changed to 20 mg daily today (BP above goal).
Recheck K and BP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-022428",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-022428",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-022428",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
