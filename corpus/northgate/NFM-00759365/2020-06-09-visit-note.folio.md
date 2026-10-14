---
folio: "0.1"
id: "01EADBA710BXQ7BJ4GFW8GZSGK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2020-06-09T12:10:00-05:00"
recorded: "2020-06-09T15:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 126/81, pulse 65, wt 191 lb.
Labs today: eGFR 68, K 4.3, UACR 206 mg/g, A1c 7.1%.
BP much better. Albuminuria noted, will follow.
<ref id="sick_day">Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink.</ref>
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-060942",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-060942",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-060942",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
