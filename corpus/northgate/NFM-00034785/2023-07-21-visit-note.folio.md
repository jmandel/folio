---
folio: "0.1"
id: "01H5WW4F602YGQHSERZJJFMGAP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034785"
effective: "2023-07-21T10:45:00-05:00"
recorded: "2023-07-21T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 143/90, repeat 141/88. Pulse 64, wt 213 lb.
eGFR 80, K 4.4 today.
Kidney function stable. Pt tolerating current regimen.
Home BP log to be brought to next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-072116",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-072116",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
