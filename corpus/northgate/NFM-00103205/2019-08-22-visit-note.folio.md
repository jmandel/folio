---
folio: "0.1"
id: "01DJX2S5K06VNG5JKQEWSFAVKK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2019-08-22T10:00:00-05:00"
recorded: "2019-08-22T11:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Brings history from prior practice.
BP 129/82, pulse 66, wt 203 lb.
Labs today: eGFR 72, K 4.3, A1c 7.2%.
Reviewed problem list with pt, entered today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-082258",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-082258",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
