---
folio: "0.1"
id: "01HR5N7E70V646NSN4KV2TE5ND"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2024-03-04T10:40:00-06:00"
recorded: "2024-03-04T15:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 134/82, pulse 79, wt 173 lb.
Labs 2/29: A1c 8.4%, eGFR 62, K 4.6, UACR 783 mg/g, LDL 80.
Insulin glargine dose changed to 14 units at bedtime today for A1c 8.4.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-030467",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-030467",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-030467",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
