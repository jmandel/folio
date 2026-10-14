---
folio: "0.1"
id: "01H9HHA4M0D6ADX8K681MYCQ7V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00743780"
effective: "2023-09-04T15:20:00-05:00"
recorded: "2023-09-04T21:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels fine, no new symptoms.

BP 136/85, pulse 87, wt 139 lb.
Labs today: eGFR 86, K 4.4, UACR 170 mg/g, A1c 6.9%.

Reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-090421",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-090421",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
