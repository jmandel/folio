---
folio: "0.1"
id: "01G36ZSMQ0BGC7PDAKRAWYRYVD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00060786"
effective: "2022-05-16T08:10:00-05:00"
recorded: "2022-05-16T12:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 129/74, pulse 62, wt 179 lb.

Labs 5/12: eGFR 84, K 4.3, LDL 54 mg/dL.

Problem list started today from pt history. RTC for BP f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-051612",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-051612",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-051612",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
