---
folio: "0.1"
id: "01H12VZ1W0E47RFMAH4HF1SMD6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00241597"
effective: "2023-05-22T13:00:00-05:00"
recorded: "2023-05-22T18:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 133/82, pulse 66, wt 198 lb.
Labs 5/16: eGFR 56, K 3.9, UACR 167 mg/g. CKD 3a on problem list.
Reviewed kidney results with pt, no new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-052239",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-052239",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-052239",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
