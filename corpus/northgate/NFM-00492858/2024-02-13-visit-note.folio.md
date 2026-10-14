---
folio: "0.1"
id: "01HPHW4370P5P77CA7JQ2332GF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00492858"
effective: "2024-02-13T09:20:00-06:00"
recorded: "2024-02-13T12:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Labs 2/8: eGFR 83, K 4.5, A1c 8.1%.
BP 137/86, pulse 85, wt 186 lb.
Metformin: dose changed to 1000 mg twice daily today (A1c 8.1). Empagliflozin: started 10 mg daily today (A1c above goal).
Lisinopril: stopped today (dry cough). Lisinopril intolerance: dry cough. Losartan: started 50 mg daily today (ACE inhibitor cough).
<ref id="sick_day">Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink.</ref>
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-021334",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-021334",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-021334",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-021334",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
