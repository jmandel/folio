---
folio: "0.1"
id: "01K6XD9760B1CE6JHV2DCRD1T2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2025-10-06T09:10:00-05:00"
recorded: "2025-10-06T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 140/85, repeat 137/83. Pulse 70, wt 194 lb.
Labs today: eGFR 51, K 4.7, UACR 633 mg/g, A1c 7.8%.
eGFR and UACR both worse. A1c 7.8%. Discussed with pt.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-100641",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-100641",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-100641",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
