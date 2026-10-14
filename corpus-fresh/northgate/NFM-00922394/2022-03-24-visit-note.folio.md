---
folio: "0.1"
id: "01FYY8WPC0R5GKY2SKJXB932M6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2022-03-24T08:00:00-05:00"
recorded: "2022-03-24T10:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints.

BP 141/80, repeat 139/77, pulse 85, wt 154 lb.
3/22: eGFR 68, K 4.6, UACR 102 mg/g, A1c 7.4%.

BP above goal. Losartan started, 50 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-032468",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-032468",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-032468",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
