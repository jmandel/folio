---
folio: "0.1"
id: "01K6BPP3W0T3JW9ZGCVD6HY6N7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00528755"
effective: "2025-09-29T11:10:00-05:00"
recorded: "2025-09-29T16:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new symptoms.

BP 131/80, pulse 74, wt 198 lb.
eGFR 77, K 4.7, UACR 48 mg/g, A1c 7.4%, LDL 102 mg/dL today.

Labs reviewed with pt. Continue diet and exercise. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092964",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092964",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
