---
folio: "0.1"
id: "01JQ7DAK00HDET8GEKG2CR11PJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342519"
effective: "2025-03-25T09:50:00-05:00"
recorded: "2025-03-25T14:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new complaints.
BP 153/87, pulse 62, wt 211 lb. BP above goal today.
eGFR 73, K 4.3 today.
Home BP readings to be brought to next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-032527",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-032527",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
