---
folio: "0.1"
id: "01F2JC7MG0NTCH75ZPBEC8KECE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2021-04-05T13:50:00-05:00"
recorded: "2021-04-05T20:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 130/72, pulse 75, wt 222 lb.
3/31 labs: eGFR 44 (CKD 3b), A1c 7.4%. K 6.5 on first draw was hemolyzed, repeat K 4.3.
Metformin dose changed to 500 mg twice daily today (eGFR 44).
Pt doing well. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-040567",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-040567",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-040567",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-040567",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
