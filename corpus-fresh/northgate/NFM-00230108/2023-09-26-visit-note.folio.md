---
folio: "0.1"
id: "01HB9KR0M03E3062JAR4V6J8G4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230108"
effective: "2023-09-26T13:50:00-05:00"
recorded: "2023-09-26T15:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 107/62, pulse 75, wt 199 lb.

Labs 9/24: eGFR 65, K 4.6, UACR 9 mg/g, A1c 8.2%.

Started semaglutide 0.5 mg weekly today for A1c 8.2. Started dapagliflozin 10 mg daily for HFrEF.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092616",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092616",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-092616",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-092616",
    "rank": 3,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
