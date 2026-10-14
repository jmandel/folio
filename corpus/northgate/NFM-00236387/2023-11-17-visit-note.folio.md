---
folio: "0.1"
id: "01HFFPFFJ06WPFZ4WDGWRQJCVJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00236387"
effective: "2023-11-17T14:50:00-06:00"
recorded: "2023-11-17T16:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 145/88, pulse 82, wt 188 lb.
Labs today: eGFR 76, K 4.7, A1c 6.7%, LDL 99 mg/dL.
No new symptoms. Discussed diet and walking.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-111713",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-111713",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-111713",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
