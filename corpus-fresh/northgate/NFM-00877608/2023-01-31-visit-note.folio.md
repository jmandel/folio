---
folio: "0.1"
id: "01GR4GCSS0QR2VFB8B3MQDGPHJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2023-01-31T10:40:00-06:00"
recorded: "2023-01-31T12:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new sx.
BP 149/91, repeat 146/90, pulse 88, wt 204 lb.
1/29 labs: eGFR 63, K 4.3, UACR 110 mg/g, A1c 7.6%.
BP above goal, lisinopril dose changed to 20 mg daily today.
RTC 3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-013164",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-013164",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-013164",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
