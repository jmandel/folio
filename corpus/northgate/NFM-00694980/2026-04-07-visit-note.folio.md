---
folio: "0.1"
id: "01KNMDNG90KZWD1D6Y7P4EGQAM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00694980"
effective: "2026-04-07T09:20:00-05:00"
recorded: "2026-04-07T11:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 146/84, pulse 75, wt 209 lb.
Labs today: eGFR 71, K 4.5, LDL 122 mg/dL.
BP above goal, chlorthalidone started 12.5 mg daily today.
Pt agrees with plan. RTC to recheck BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-040787",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-040787",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
