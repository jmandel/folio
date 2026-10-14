---
folio: "0.1"
id: "01J18WNFP04Y7671CJJTRQ9HJP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00589924"
effective: "2024-06-25T13:30:00-05:00"
recorded: "2024-06-25T18:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feeling well, no complaints.
BP 141/85, repeat 133/81. Pulse 78, wt 203 lb.
Labs 6/21: eGFR 68, K 4.4, A1c 7.9%, LDL 154 mg/dL.
Lisinopril dose changed to 40 mg daily today, BP above goal.
RTC for recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062512",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062512",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-062512",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
