---
folio: "0.1"
id: "01FNPTF680CFNBP7V3BGN1C3SZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2021-11-29T11:00:00-06:00"
recorded: "2021-11-29T15:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well.
BP 142/90, repeat 140/89, pulse 71, wt 190 lb.
Labs 11/25: eGFR 62, K 4.5, A1c 6.9%, LDL 104 mg/dL.
BP still above goal, chlorthalidone started 12.5 mg daily today.
BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112948",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-112948",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
