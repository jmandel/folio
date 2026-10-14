---
folio: "0.1"
id: "01E8CH2FK09N9JGRA3BT3DQS6F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00487681"
effective: "2020-05-15T09:00:00-05:00"
recorded: "2020-05-15T11:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 141/87, repeat 136/83. Pulse 74, wt 199 lb.

Labs 5/9: eGFR 68, K 4.6, UACR 65 mg/g, A1c 6.9%, LDL 108 mg/dL.

Reviewed results with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-051516",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-051516",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
