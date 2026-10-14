---
folio: "0.1"
id: "01HD4YHQM0YPDK3K4G76GA1GPB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00176879"
effective: "2023-10-19T13:20:00-05:00"
recorded: "2023-10-19T16:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, problem list entered.
BP 137/77, pulse 71, wt 225 lb.
Labs today: eGFR 79, K 4.6.
Pt voiced no acute concerns.
RTC for BP f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101929",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-101929",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-101929",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
