---
folio: "0.1"
id: "01GRCDY6P0VGNB7X37ZM5J997S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531163"
effective: "2023-02-03T09:45:00-06:00"
recorded: "2023-02-03T14:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 144/88, repeat 139/87, pulse 77, wt 183 lb.
eGFR 77, K 4.5, A1c 6.1%, LDL 142 mg/dL today.

BP above goal, lisinopril increased to 20 mg daily today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020384",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-020384",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
