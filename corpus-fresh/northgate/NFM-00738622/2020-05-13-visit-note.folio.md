---
folio: "0.1"
id: "01E8824GD09JF7Y83MNK6H0Z97"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2020-05-13T14:15:00-05:00"
recorded: "2020-05-13T17:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No complaints today.
BP 129/76, pulse 87, wt 214 lb.
A1c 6.9%, eGFR 71, K 4.3 today. LDL 159 mg/dL.
A1c much better. LDL still high, discussed diet and will recheck.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-051326",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-051326",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
