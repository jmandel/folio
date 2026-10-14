---
folio: "0.1"
id: "01FSMXTN906Y9V7D5C0593Y30Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00560147"
effective: "2022-01-17T08:45:00-06:00"
recorded: "2022-01-17T15:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No headache or dizziness.
BP 146/88, repeat 139/88, pulse 80, wt 188 lb.
Labs 1/11: eGFR 85, K 4.7.
BP above goal, chlorthalidone started 12.5 mg daily today.
Recheck BP and labs at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-011713",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-011713",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
