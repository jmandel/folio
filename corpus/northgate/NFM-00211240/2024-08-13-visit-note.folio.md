---
folio: "0.1"
id: "01J56PBGC0YF4ZX639G0ME2FA0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00211240"
effective: "2024-08-13T08:50:00-05:00"
recorded: "2024-08-13T15:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well, no new complaints.
BP 134/77, pulse 81, wt 197 lb.
8/7 labs: eGFR 33, K 4.8. CKD stage 3b on problem list.
Reviewed results with pt, will recheck labs at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-081398",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-081398",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
