---
folio: "0.1"
id: "01HJS3M540RV2KG65478TGYWTD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620560"
effective: "2023-12-28T10:45:00-06:00"
recorded: "2023-12-28T15:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 125/72, pulse 78, wt 168 lb.
eGFR 66, K 4.6, LDL 98 today.
BP controlled. Doing well overall.
RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-122876",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-122876",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
