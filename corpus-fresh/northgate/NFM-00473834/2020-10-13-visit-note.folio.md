---
folio: "0.1"
id: "01EMHHV2N092PD40F6YNSKTS6R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00473834"
effective: "2020-10-13T08:30:00-05:00"
recorded: "2020-10-13T12:59:00-05:00"
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
BP 138/82, pulse 78, wt 237 lb.
Labs today: eGFR 65, K 4.5, A1c 7%, LDL 59.
Problem list built from pt's history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-101349",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-101349",
    "rank": 1,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
