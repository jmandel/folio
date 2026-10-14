---
folio: "0.1"
id: "01GTABPYM06E9A29XCXSRPX3YD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00164285"
effective: "2023-02-27T10:50:00-06:00"
recorded: "2023-02-27T15:16:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.

BP 148/84, repeat 145/84, pulse 75, wt 196 lb.

Labs today: eGFR 53, K 4.5, UACR 62 mg/g, A1c 8.2%, LDL 154 mg/dL.

Empagliflozin started 10 mg daily today (A1c 8.2).

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-022729",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-022729",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
