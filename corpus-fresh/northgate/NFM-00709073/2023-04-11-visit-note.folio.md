---
folio: "0.1"
id: "01GXS9KR9062N7HB4V1MF65D67"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00709073"
effective: "2023-04-11T14:45:00-05:00"
recorded: "2023-04-11T18:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 134/78, pulse 66, wt 231 lb.
Today eGFR 79, K 4.5, UACR 178 mg/g, A1c 7.3%, LDL 155.
LDL higher than before, reviewed diet. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-041199",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-041199",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
