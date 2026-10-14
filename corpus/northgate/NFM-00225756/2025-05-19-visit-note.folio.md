---
folio: "0.1"
id: "01JVN32HK07MMP0MY84350M624"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00225756"
effective: "2025-05-19T09:15:00-05:00"
recorded: "2025-05-19T15:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.

BP 149/88, repeat 146/87, pulse 71, wt 214 lb.
Labs today: eGFR 77, K 4.4, A1c 6.4%, UACR 608 mg/g.

BP above goal, so chlorthalidone started, 12.5 mg daily today.
Recheck BMP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051916",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051916",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
