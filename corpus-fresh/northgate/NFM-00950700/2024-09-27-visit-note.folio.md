---
folio: "0.1"
id: "01J8TKE9V0Z512DDWEHCSRA5BT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00950700"
effective: "2024-09-27T12:00:00-05:00"
recorded: "2024-09-27T15:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 122/75, pulse 84, wt 144 lb.
eGFR 60, K 4.5, A1c 8.1% today.
Insulin glargine dose changed to 18 units at bedtime today (A1c 8.1).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-092766",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-092766",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-092766",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
