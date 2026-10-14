---
folio: "0.1"
id: "01G2N7DS00FXK3BJAV3GP1F03W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2022-05-09T12:00:00-05:00"
recorded: "2022-05-09T15:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 131/78, pulse 88, wt 188 lb.
Labs today: eGFR 61, K 4.6, A1c 6.6%.
Numbers reviewed with pt, continue current plan.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-050994",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-050994",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
