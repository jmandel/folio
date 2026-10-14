---
folio: "0.1"
id: "01KJ6K64506X9A69WKEPJ4CYJZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00225756"
effective: "2026-02-23T12:50:00-06:00"
recorded: "2026-02-23T19:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 142/91, repeat 136/91, pulse 67, wt 212 lb.
Labs today: eGFR 77, K 4.3, A1c 6.3%, LDL 116 mg/dL, UACR 446 mg/g.

BP above goal, amlodipine started, 5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-022363",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-022363",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-022363",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
