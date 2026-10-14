---
folio: "0.1"
id: "01J2CBP9A0TXZPGDQYMRXN4PDP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490101"
effective: "2024-07-09T10:50:00-05:00"
recorded: "2024-07-09T13:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 141/85, repeat 139/82. Pulse 79, wt 228 lb.
Labs today: eGFR 41, K 4.6, UACR 11 mg/g, LDL 105 mg/dL.
Referred to nephrology for the eGFR.
RTC for BP f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-070977",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-070977",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-070977",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
