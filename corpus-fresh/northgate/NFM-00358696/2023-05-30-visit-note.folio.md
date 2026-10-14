---
folio: "0.1"
id: "01H1PZPDJ07H8NJYRQTD0KTDQW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00358696"
effective: "2023-05-30T11:50:00-05:00"
recorded: "2023-05-30T13:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx HTN, hyperlipidemia, obesity, knee OA per pt.
BP 144/91, repeat 139/88, pulse 73, wt 213 lb.
eGFR 40 today, K 4.6. LDL 94 mg/dL.
BP above goal. Referring to nephrology for CKD eval.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-053041",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-053041",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
