---
folio: "0.1"
id: "01F22PVY20M23APRZKP0KZZTBC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2021-03-30T15:45:00-05:00"
recorded: "2021-03-30T18:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 144/87, pulse 74, wt 216 lb.
eGFR 77 today, K 4.4.
LDL 161 mg/dL today, discussed with pt.
BP above goal today. Pt to keep checking at home.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-033096",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-033096",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
