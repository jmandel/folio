---
folio: "0.1"
id: "01G9Z728R0QYMMX55DQ61WM2D9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00128158"
effective: "2022-08-08T10:30:00-05:00"
recorded: "2022-08-08T12:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 143/86, pulse 83, wt 199 lb. Pt c/o dry cough.
Lisinopril stopped today (dry cough). Losartan started 50 mg daily today (ACE inhibitor cough). Lisinopril intolerance: dry cough, added to allergy list.
Labs today: A1c 7.3%, eGFR 68, K 4.4, UACR 11 mg/g.
RTC 3 mo, recheck BP then.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-080855",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-080855",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-080855",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
