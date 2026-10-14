---
folio: "0.1"
id: "01H53147Q033FN4D7V6826EGRB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00826248"
effective: "2023-07-11T09:50:00-05:00"
recorded: "2023-07-11T12:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 124/69, pulse 81, wt 157 lb.
Labs today: eGFR 46, K 4.5, UACR 13 mg/g, A1c 6.8%, LDL 135 mg/dL.
Discussed results with pt, questions answered.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-071175",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
