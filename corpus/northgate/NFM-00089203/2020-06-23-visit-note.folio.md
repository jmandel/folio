---
folio: "0.1"
id: "01EBHE6CP0SQVRVPNQ2GZVSF2A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00089203"
effective: "2020-06-23T13:00:00-05:00"
recorded: "2020-06-23T15:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 148/84, repeat 142/80. Pulse 67, wt 201 lb.
eGFR 67 today, K 4.4.
LDL 76 mg/dL.
Will recheck BP at next visit.
RTC for BP f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-062388",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-062388",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
