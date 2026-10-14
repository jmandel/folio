---
folio: "0.1"
id: "01HYH4ET70WE09RVEPCTA8Z9WX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00681589"
effective: "2024-05-22T11:40:00-05:00"
recorded: "2024-05-22T16:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 141/85, repeat 134/82. Pulse 75, wt 157 lb.
eGFR 95, LDL 94 mg/dL today.
First K 6.3 was hemolyzed; repeat K 4.7.
BP above goal, chlorthalidone started 12.5 mg daily today.
RTC for BP and BMP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052282",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052282",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-052282",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-052282",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
