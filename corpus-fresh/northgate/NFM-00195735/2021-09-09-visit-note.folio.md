---
folio: "0.1"
id: "01FF6NYK505YYPWTE6B6C1V6CH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00195735"
effective: "2021-09-09T15:40:00-05:00"
recorded: "2021-09-09T20:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 153/96, repeat 150/95. Pulse 78, wt 197 lb.
Labs today: eGFR 59, K 4.4, UACR 251 mg/g, A1c 7.8%, LDL 103.
BP above goal, started chlorthalidone 12.5 mg daily today.
Pt informed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-090944",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-090944",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-090944",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
