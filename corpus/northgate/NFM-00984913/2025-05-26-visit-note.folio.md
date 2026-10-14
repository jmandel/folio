---
folio: "0.1"
id: "01JW7R03K0CS8S3GPEC6MRTVXG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00984913"
effective: "2025-05-26T15:00:00-05:00"
recorded: "2025-05-26T21:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u.

lisinopril: resumed today (creatinine back to baseline)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052698",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-052698",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
