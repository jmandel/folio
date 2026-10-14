---
folio: "0.1"
id: "01H3HXJAC04G8HXT5VSWP7RVS7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2023-06-22T08:20:00-05:00"
recorded: "2023-06-22T11:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 146/85, repeat 144/81, pulse 88, wt 134 lb.
eGFR 85, K 4.5 today.
BP still above goal. Amlodipine started 5 mg daily today.
Pt to report any ankle swelling. RTC 1 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-062211",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-062211",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
