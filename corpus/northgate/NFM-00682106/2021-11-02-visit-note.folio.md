---
folio: "0.1"
id: "01FKGY0DH0TAVY5PTCG2HYVH2E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00682106"
effective: "2021-11-02T08:20:00-05:00"
recorded: "2021-11-02T13:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.

BP 121/73, pulse 85, wt 243 lb.
Labs 10/31: eGFR 70, K 4.5, UACR 74 mg/g, A1c 6.2%, LDL 161 mg/dL.

Went over results with pt. LDL discussed, diet reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110232",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-110232",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-110232",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
