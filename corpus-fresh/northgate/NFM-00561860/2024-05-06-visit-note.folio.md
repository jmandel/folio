---
folio: "0.1"
id: "01HX7D5AF0D1P2X78AKQGQAFPE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00561860"
effective: "2024-05-06T10:15:00-05:00"
recorded: "2024-05-06T11:53:00-05:00"
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
BP 162/96, repeat 154/96, pulse 72, wt 229 lb.
eGFR 85, K 4.5, UACR 6 mg/g, A1c 6.4%, LDL 102 mg/dL today.
BP above goal, chlorthalidone started 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-050652",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-050652",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
