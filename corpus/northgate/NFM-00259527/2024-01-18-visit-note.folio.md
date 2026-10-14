---
folio: "0.1"
id: "01HMEY9WJ027G30BABXEFMP2RQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00259527"
effective: "2024-01-18T08:45:00-06:00"
recorded: "2024-01-18T12:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.

BP 139/80, pulse 75, wt 230 lb. Labs 1/14: eGFR 61, K 4.5, UACR 383 mg/g, A1c 6.8%, LDL 62 mg/dL.

Results reviewed with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011876",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-011876",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-011876",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-011876",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
