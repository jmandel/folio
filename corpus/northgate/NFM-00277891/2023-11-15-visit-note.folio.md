---
folio: "0.1"
id: "01HFAQR4G0ZBHY4FKFCTZH51TF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2023-11-15T13:10:00-06:00"
recorded: "2023-11-15T18:16:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 143/80, pulse 78, wt 157 lb.

eGFR 68, K 4.6 today.

Lisinopril: held today (K 5.6 confirmed on repeat); review 11/29.
Pt aware.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-111547",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-111547",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
