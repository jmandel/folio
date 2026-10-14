---
folio: "0.1"
id: "01G3S772K0H4MK5S2SPCWFV0TE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00448962"
effective: "2022-05-23T11:50:00-05:00"
recorded: "2022-05-23T14:45:00-05:00"
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
BP 138/76, pulse 78, wt 263 lb.
Today: eGFR 66, K 4.6, UACR 105 mg/g, A1c 6.4%.
UACR higher than before, discussed with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-052318",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-052318",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
