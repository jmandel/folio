---
folio: "0.1"
id: "01HTGKSK10EE0GG3XPZFN8TYVK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813619"
effective: "2024-04-02T14:15:00-05:00"
recorded: "2024-04-02T18:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx HTN, DM2 and obesity per pt.

BP 135/80, pulse 81, wt 234 lb. Labs 3/30: eGFR 42, K 4.4, A1c 6.9%, LDL 133.

Metformin dose changed to 500 mg twice daily today (eGFR 42).

Referral to nephrology placed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040211",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040211",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-040211",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
