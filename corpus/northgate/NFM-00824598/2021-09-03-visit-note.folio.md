---
folio: "0.1"
id: "01FEP5MF20FHHQ53YHTGYF93VJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00824598"
effective: "2021-09-03T09:00:00-05:00"
recorded: "2021-09-03T10:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.
BP 122/81, pulse 82, wt 262 lb.
Labs 8/28: eGFR 66, K 4, UACR 8 mg/g, A1c 6.6%.
Results reviewed with pt. Diet and activity discussed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-090335",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-090335",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
