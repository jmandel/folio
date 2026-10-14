---
folio: "0.1"
id: "01EKZRS7T0NBN5972PNS35WAZM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591713"
effective: "2020-10-06T12:45:00-05:00"
recorded: "2020-10-06T15:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u visit. Doing well, no new complaints.

BP 121/74, pulse 65, wt 163 lb.
eGFR 69 today, LDL 70 mg/dL today. Reviewed with pt.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-100637",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-100637",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
