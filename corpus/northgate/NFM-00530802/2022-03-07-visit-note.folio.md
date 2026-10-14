---
folio: "0.1"
id: "01FXK4KZY0PVCP09EH11FVP89Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00530802"
effective: "2022-03-07T09:15:00-06:00"
recorded: "2022-03-07T15:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 146/89, pulse 72, wt 205 lb.
Labs 3/5: eGFR 100, K 4.3, A1c 7.4%.
BP above goal, so chlorthalidone started 12.5 mg daily today.
Pt to call with any dizziness. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-030771",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-030771",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
