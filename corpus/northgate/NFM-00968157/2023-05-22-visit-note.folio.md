---
folio: "0.1"
id: "01H124GAE0TPW5HGGJH1YQN34D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00968157"
effective: "2023-05-22T09:30:00-05:00"
recorded: "2023-05-22T11:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 125/70, pulse 64, wt 172 lb.
Labs 5/17: eGFR 45, K 4.6, UACR 232 mg/g, A1c 8.3%, LDL 83.
Dapagliflozin started 10 mg daily today (A1c 8.3, CKD).
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-052265",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-052265",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
