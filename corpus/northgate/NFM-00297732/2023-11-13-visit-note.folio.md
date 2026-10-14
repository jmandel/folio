---
folio: "0.1"
id: "01HF5BB5H0QSWAVDCHH7M3ZBMZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00297732"
effective: "2023-11-13T10:15:00-06:00"
recorded: "2023-11-13T16:03:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u visit. Doing well, no new complaints.

BP 120/75, pulse 65, wt 203 lb.

eGFR 77 today.

Reviewed result with pt. RTC as scheduled.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-111355",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-111355",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
