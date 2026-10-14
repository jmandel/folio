---
folio: "0.1"
id: "01FWPQV600N4HY5V5EK80BR2SB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00271285"
effective: "2022-02-24T13:15:00-06:00"
recorded: "2022-02-24T14:48:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feeling well.
BP 142/87, pulse 65, wt 182 lb.
Labs today: eGFR 69, K 4.3, A1c 7.7%.
BP above goal, so losartan dose changed to 100 mg daily today.
Recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-022425",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-022425",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
