---
folio: "0.1"
id: "01HZ2ZD2N0HVTRJBSFGAPAJ2TD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976595"
effective: "2024-05-29T12:10:00-05:00"
recorded: "2024-05-29T15:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No complaints.
BP 141/79, repeat 137/76, pulse 82, wt 140 lb.
eGFR 69 and K 4.4 on 5/26.
BP above goal. Lisinopril dose changed to 20 mg daily today.
Recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052959",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052959",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
