---
folio: "0.1"
id: "01DXYNS8303NKD4HFMCD3BNQQE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00563111"
effective: "2020-01-06T14:20:00-06:00"
recorded: "2020-01-06T18:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 159/98, repeat 153/98. Pulse 73, wt 195 lb.

Labs 12/31/19: eGFR 55, K 4.7, UACR 53 mg/g, A1c 6.6%, LDL 76.

BP elevated on both readings. Problem list built from pt's history. Will recheck at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-010658",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-010658",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-010658",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
