---
folio: "0.1"
id: "01JC22V8R08VG55D63V0E8DH9R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00125465"
effective: "2024-11-06T14:50:00-06:00"
recorded: "2024-11-06T19:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well, no new symptoms.

BP 151/87, repeat 147/83. Pulse 81, wt 249 lb.

eGFR 80, K 3.9, LDL 76 mg/dL today.

Lisinopril changed to 40 mg daily today, BP above goal. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-110648",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-110648",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-110648",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
