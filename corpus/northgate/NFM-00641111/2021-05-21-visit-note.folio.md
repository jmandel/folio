---
folio: "0.1"
id: "01F67TXYR0GSZCZVN5YQD1SSDE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00641111"
effective: "2021-05-21T08:20:00-05:00"
recorded: "2021-05-21T11:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-052188",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-052188",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
