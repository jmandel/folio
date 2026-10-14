---
folio: "0.1"
id: "01EQC1FKC0XBAPDWCMAG8MM31Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2020-11-17T09:20:00-06:00"
recorded: "2020-11-17T15:24:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 143/87, repeat 140/86. Pulse 64, wt 163 lb.
Labs today: eGFR 49, K 4.6, A1c 8.2%, LDL 90 mg/dL.
Dapagliflozin started 10 mg daily today (A1c 8.2, CKD).
Pt voiced understanding. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-111754",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-111754",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
