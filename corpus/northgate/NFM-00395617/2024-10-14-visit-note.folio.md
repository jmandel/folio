---
folio: "0.1"
id: "01JA6XFG501W14G2QTS43SWYN6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2024-10-14T14:15:00-05:00"
recorded: "2024-10-14T20:43:00-05:00"
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
BP 139/82, pulse 69, wt 212 lb.
Today eGFR 72, K 4.4, A1c 8.2%.
A1c up, so empagliflozin started 10 mg daily today (A1c 8.2). Counseled pt on hydration and genital hygiene.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101419",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-101419",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
