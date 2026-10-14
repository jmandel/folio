---
folio: "0.1"
id: "01DYG90AC0YX8TP7AG2J9PBHPR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2020-01-13T12:00:00-06:00"
recorded: "2020-01-13T14:20:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 117/73, pulse 76, wt 195 lb.
eGFR 47, K 4.2, UACR 192 mg/g, A1c 8.8%, LDL 126.
Dapagliflozin started 10 mg daily today (A1c 8.8, CKD).
RTC for recheck of labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-011355",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-011355",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
