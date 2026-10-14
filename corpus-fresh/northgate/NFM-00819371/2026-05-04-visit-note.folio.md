---
folio: "0.1"
id: "01KQTA9RS0WYVTVT0TQ0XQ45FN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00819371"
effective: "2026-05-04T10:10:00-05:00"
recorded: "2026-05-04T15:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No new complaints.

BP 144/81, repeat 142/77, pulse 62, wt 191 lb.

eGFR 94, K 4.4, LDL 103 mg/dL today.

BP above goal, chlorthalidone started 12.5 mg daily today. RTC 1 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-050463",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-050463",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
