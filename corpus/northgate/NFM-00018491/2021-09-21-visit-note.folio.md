---
folio: "0.1"
id: "01FG53KTD05KZYFHK5WYTMP7V7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00018491"
effective: "2021-09-21T10:20:00-05:00"
recorded: "2021-09-21T16:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 133/81, pulse 86, wt 194 lb.
eGFR 92, K 4.2, LDL 62 mg/dL today.
BP much improved. Labs reassuring.
Continue current plan. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092156",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092156",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
