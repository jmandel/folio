---
folio: "0.1"
id: "01GQV1F6F0Y4GXPS72CVYBKZ9F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00615037"
effective: "2023-01-27T15:50:00-06:00"
recorded: "2023-01-27T19:57:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 149/86, pulse 76, wt 176 lb.
Labs today: eGFR 52, K 4.3, LDL 121 mg/dL.
History reviewed with pt, problem list entered.
RTC to review BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-012752",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-012752",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
