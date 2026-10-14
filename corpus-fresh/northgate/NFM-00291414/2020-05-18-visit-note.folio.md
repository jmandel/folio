---
folio: "0.1"
id: "01E8MP0330KK7W0EVK2N6D3ZXF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2020-05-18T12:00:00-05:00"
recorded: "2020-05-18T15:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN and DM2 per pt.
BP 131/84, pulse 62, wt 165 lb.
Labs today: eGFR 69, K 4.6, UACR 7 mg/g, A1c 6.2%, LDL 170 mg/dL.
Kidney function and urine albumin normal. LDL high, will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-051876",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-051876",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
