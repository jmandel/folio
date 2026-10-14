---
folio: "0.1"
id: "01FG4YD6C059JXFRMDBA33H5M6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272471"
effective: "2021-09-21T11:40:00-05:00"
recorded: "2021-09-21T14:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing ok, no hypoglycemia symptoms.
BP 112/65, pulse 68, wt 152 lb.
Labs today: eGFR 65, K 4.7, A1c 8.4%.
Metformin dose changed to 1000 mg twice daily today (A1c 8.4).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092145",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092145",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-092145",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
