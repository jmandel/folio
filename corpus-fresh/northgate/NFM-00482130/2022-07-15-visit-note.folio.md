---
folio: "0.1"
id: "01G81H4C50YNMFGWZXTWSQC5XK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2022-07-15T09:30:00-05:00"
recorded: "2022-07-15T13:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No complaints.
BP 142/83, pulse 85, wt 161 lb.
Labs today: eGFR 61, K 4.4, A1c 7.6%.
BP a bit high today, pt to check at home. Diet and activity discussed.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071531",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071531",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
