---
folio: "0.1"
id: "01JGD9D1K0HXFYEF4KRK22ZBA4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00454123"
effective: "2024-12-30T14:50:00-06:00"
recorded: "2024-12-30T20:41:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt feels well, no new complaints.

BP 116/73, pulse 83, wt 202 lb.

Labs today: eGFR 97, K 5.1, UACR 223 mg/g, A1c 7.4%.

Dapagliflozin started 10 mg daily today for HFrEF. Results reviewed with pt.

RTC for f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-123071",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-123071",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-123071",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
