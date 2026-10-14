---
folio: "0.1"
id: "01EX5WVRJ0H2AZVYZGPBWSMTNB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00914845"
effective: "2021-01-28T14:40:00-06:00"
recorded: "2021-01-28T19:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.
BP 116/61, pulse 80, wt 300 lb.
Labs 1/24: eGFR 87, K 4.5. Reviewed with pt.
RTC 1 yr, sooner prn.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-012888",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-012888",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
