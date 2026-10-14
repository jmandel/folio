---
folio: "0.1"
id: "01HYYCSXF05NFCW68ZD3C63V6W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00298630"
effective: "2024-05-27T15:30:00-05:00"
recorded: "2024-05-27T20:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 134/73, pulse 74, wt 121 lb.
Labs today: A1c 8.3%, eGFR 90, K 4.4, UACR 170 mg/g, LDL 49 mg/dL.
Semaglutide started 0.5 mg weekly today for A1c 8.3.
Dapagliflozin started 10 mg daily today for HFrEF.
Reviewed what to expect with both. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052795",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052795",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-052795",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-052795",
    "rank": 3,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
