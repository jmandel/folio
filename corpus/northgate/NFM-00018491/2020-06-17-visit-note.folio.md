---
folio: "0.1"
id: "01EB20AJ10D44WQVPKM2WQ9ZS3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00018491"
effective: "2020-06-17T11:15:00-05:00"
recorded: "2020-06-17T15:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 149/90, pulse 75, wt 192 lb.
Labs 6/13: eGFR 96, K 4.2, LDL 101 mg/dL.
BP above goal, chlorthalidone started 12.5 mg daily today.
Pt to report dizziness or cramping. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-061737",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-061737",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
