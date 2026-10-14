---
folio: "0.1"
id: "01ED9SG2Q0XFB1XFMGW78P44CK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00853558"
effective: "2020-07-15T08:40:00-05:00"
recorded: "2020-07-15T12:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt reports dry cough on the ACE inhibitor.
BP 129/86, pulse 79, wt 167 lb.
Labs 7/11: eGFR 100, K 5, UACR 209 mg/g, A1c 7.4%, LDL 77 mg/dL.
Lisinopril: stopped today (dry cough). Losartan: started 50 mg daily today (ACE inhibitor cough). Lisinopril intolerance: dry cough, added to allergy list.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-071597",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-071597",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-071597",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-071597",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
