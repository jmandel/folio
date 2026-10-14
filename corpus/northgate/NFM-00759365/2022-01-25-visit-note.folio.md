---
folio: "0.1"
id: "01FT99GHG00W5M3BTT3V4YKHX7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2022-01-25T09:40:00-06:00"
recorded: "2022-01-25T12:56:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 129/80, pulse 66, wt 194 lb.
Labs 1/21: eGFR 66, K 4.4, UACR 226 mg/g, A1c 7.3%.
No new complaints. UACR persistently high.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-012551",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-012551",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-012551",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
