---
folio: "0.1"
id: "01JRZPB190S04900V0FS1803ZP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00507463"
effective: "2025-04-16T09:45:00-05:00"
recorded: "2025-04-16T11:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 148/90, repeat 146/88, pulse 81, wt 211 lb.
Today: eGFR 93, K 4.6, A1c 8%, LDL 118.
BP above goal, chlorthalidone started today at 12.5 mg daily.
RTC 3 mo, recheck BP and K.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041693",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-041693",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
