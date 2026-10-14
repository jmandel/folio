---
folio: "0.1"
id: "01HXT8AF60JGVSBXEGMC0GNWNE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00664672"
effective: "2024-05-13T15:10:00-05:00"
recorded: "2024-05-13T19:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt feels ok, no new complaints.
BP 128/73, pulse 88, wt 256 lb.
Labs today: eGFR 64, K 4.5, A1c 8.2%.
A1c above goal, so started insulin glargine 10 units at bedtime today. Reviewed use with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051323",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051323",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-051323",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
