---
folio: "0.1"
id: "01HK3HGBN0XFMNGFGPVSDYNFZQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2024-01-01T11:10:00-06:00"
recorded: "2024-01-01T16:15:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 152/89, repeat 149/86, pulse 86, wt 163 lb.
Labs today: eGFR 60, K 4.7, A1c 7.3%.
BP elevated on both readings. Pt to log home BPs.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010112",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010112",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
