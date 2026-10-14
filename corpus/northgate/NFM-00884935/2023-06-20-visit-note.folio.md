---
folio: "0.1"
id: "01H3DBHF40CK8DDTMAJJ5XEQP0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00884935"
effective: "2023-06-20T12:40:00-05:00"
recorded: "2023-06-20T16:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 150/88, repeat 147/84, pulse 65, wt 166 lb.
Labs 6/16: eGFR 64, K 4.1, UACR 9 mg/g.
BP still above goal. Chlorthalidone started 12.5 mg daily today.
Pt to report any dizziness. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-062059",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-062059",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
