---
folio: "0.1"
id: "01EP5MNPK0QTTYH755J1AWJ1RR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2020-11-02T14:15:00-06:00"
recorded: "2020-11-02T17:29:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 147/82, repeat 141/78. Pulse 75, wt 241 lb.
Labs 10/28: eGFR 92, K 4.4, A1c 7.1%.
BP above goal. Lisinopril dose changed to 20 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-110248",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-110248",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
