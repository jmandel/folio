---
folio: "0.1"
id: "01FYSM09E03JH64616ET531QJP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2022-03-22T09:10:00-05:00"
recorded: "2022-03-22T15:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 143/82, repeat 138/79. Pulse 77, wt 194 lb.
Today: eGFR 67, K 4.4, UACR 267 mg/g, A1c 8%, LDL 173.
A1c and LDL both up. Diet and adherence reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-032222",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-032222",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-032222",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
