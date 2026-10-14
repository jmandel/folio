---
folio: "0.1"
id: "01FQD612V0A7FRY39VR7Y0TD3R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00850967"
effective: "2021-12-20T14:15:00-06:00"
recorded: "2021-12-20T18:25:00-06:00"
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
BP 129/77, pulse 64, wt 222 lb.
Labs 12/17: eGFR 67, K 4.2, UACR 12 mg/g, A1c 8.3%, LDL 55 mg/dL.
A1c up at 8.3, so empagliflozin started today, 10 mg daily. Pt counseled on what to expect.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-122082",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-122082",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
