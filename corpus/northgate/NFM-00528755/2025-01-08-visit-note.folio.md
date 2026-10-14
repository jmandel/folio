---
folio: "0.1"
id: "01JH4B8G00TMHDWN0FS0NP2PMZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00528755"
effective: "2025-01-08T13:45:00-06:00"
recorded: "2025-01-08T19:36:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.

BP 140/76, repeat 138/73, pulse 84, wt 197 lb.
eGFR 82, K 4.7, A1c 7.3% today.

BP above goal. Lisinopril dose changed to 40 mg daily today. Recheck BP and K at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-010874",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-010874",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-010874",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
