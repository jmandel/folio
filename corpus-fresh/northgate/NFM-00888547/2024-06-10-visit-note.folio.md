---
folio: "0.1"
id: "01J022MKR012SY1DCJE42BXTGR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00888547"
effective: "2024-06-10T12:20:00-05:00"
recorded: "2024-06-10T17:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well.

BP 136/77, pulse 80, wt 200 lb.
eGFR 67, K 4.5, LDL 80 mg/dL today.

Labs stable. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-061097",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-061097",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
