---
folio: "0.1"
id: "01FWS7QAW0777RMQSVSY1KHFCW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2022-02-25T09:45:00-06:00"
recorded: "2022-02-25T14:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 144/87, repeat 136/84. Pulse 82, wt 197 lb.
Labs today: eGFR 90, K 4.4, A1c 8.1%, LDL 57.
A1c above goal. Empagliflozin started 10 mg daily today (A1c 8.1).
History reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-022516",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-022516",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
