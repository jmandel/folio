---
folio: "0.1"
id: "01FX3JXFG0SR55G5P35ZW0XV2A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00176898"
effective: "2022-03-01T11:30:00-06:00"
recorded: "2022-03-01T14:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx HTN and DM2 per pt.
BP 130/80, pulse 86, wt 184 lb.
Labs today: eGFR 42, K 5.1, A1c 6.6%, LDL 166 mg/dL.
Metformin dose changed to 500 mg twice daily today (eGFR 42).
Nephrology referral placed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-030197",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-030197",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-030197",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
