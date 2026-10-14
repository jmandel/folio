---
folio: "0.1"
id: "01HFA6DAK05CHVTZ7ZEKXAYP2M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00799124"
effective: "2023-11-15T11:20:00-06:00"
recorded: "2023-11-15T13:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 128/86, pulse 68, wt 197 lb.
Dry cough on lisinopril, no swelling. Lisinopril stopped today (dry cough), listed as intolerance: dry cough.
Losartan started 50 mg daily today for the ACE inhibitor cough.
Labs today: eGFR 50, K 4.8, UACR 43 mg/g, LDL 130 mg/dL. CKD stage 3a on problem list.
Recheck BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-111584",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-111584",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-111584",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
