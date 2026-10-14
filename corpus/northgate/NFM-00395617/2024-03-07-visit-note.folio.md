---
folio: "0.1"
id: "01HRDMQ3A05A96JRMP5V6K3WV7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2024-03-07T11:20:00-06:00"
recorded: "2024-03-07T17:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feeling well.
BP 135/81, pulse 75, wt 213 lb.
Today eGFR 71, K 4.2, A1c 7.7%, LDL 124 mg/dL.
Reviewed labs with pt, A1c a little higher. Diet and exercise reinforced.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-030795",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-030795",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
