---
folio: "0.1"
id: "01H6SM6030K30D67RKV8TF7R2R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337133"
effective: "2023-08-01T12:00:00-05:00"
recorded: "2023-08-01T17:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 132/88, pulse 87, wt 173 lb.
Labs today: eGFR 91, K 4.2, UACR 7 mg/g, A1c 6.9%.
Results reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-080137",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-080137",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
