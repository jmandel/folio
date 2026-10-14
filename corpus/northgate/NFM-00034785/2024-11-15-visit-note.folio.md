---
folio: "0.1"
id: "01JCRVQ7Y06WAAC6BD10XXBJQ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034785"
effective: "2024-11-15T10:10:00-06:00"
recorded: "2024-11-15T15:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 140/82, repeat 134/81. Pulse 83, wt 209 lb.
eGFR 77, K 4.1 today. LDL 130 mg/dL today.
Discussed diet and exercise. Pt agrees to keep a home BP log.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111597",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111597",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
