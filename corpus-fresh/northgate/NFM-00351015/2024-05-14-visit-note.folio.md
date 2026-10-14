---
folio: "0.1"
id: "01HXWPA6F0Z9H0P4S5M8JXSA2G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2024-05-14T15:40:00-05:00"
recorded: "2024-05-14T18:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 141/78, pulse 76, wt 152 lb.
Labs 5/11: eGFR 89, K 4.7, UACR 53 mg/g, A1c 8.3%.
Insulin glargine dose changed to 18 units at bedtime today (A1c 8.3). BP above goal, chlorthalidone started 12.5 mg daily today.
BMP in 2 wks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051456",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051456",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-051456",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-051456",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
