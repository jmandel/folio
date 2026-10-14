---
folio: "0.1"
id: "01FN4KQQG0HEXNSKZ4SRTPAN00"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00225232"
effective: "2021-11-22T08:40:00-06:00"
recorded: "2021-11-22T14:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 150/93, repeat 148/91, pulse 64, wt 183 lb.
Labs today: eGFR 91, K 4.6, A1c 7.6%, LDL 119 mg/dL.
BP above goal, losartan dose changed to 100 mg daily today.
RTC 3 mo, BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112223",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-112223",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-112223",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
