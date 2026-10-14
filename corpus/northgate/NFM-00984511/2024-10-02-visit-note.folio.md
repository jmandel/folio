---
folio: "0.1"
id: "01J97RMPE0575MCT8DYT55VN3E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00984511"
effective: "2024-10-02T15:15:00-05:00"
recorded: "2024-10-02T18:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.

BP 149/92, repeat 144/90, pulse 84, wt 237 lb.

Labs today: eGFR 93, K 4.

BP above goal, so lisinopril changed to 20 mg daily today. RTC 3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-100294",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-100294",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-100294",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
