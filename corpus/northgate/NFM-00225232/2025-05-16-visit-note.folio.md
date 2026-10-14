---
folio: "0.1"
id: "01JVDMXPD0NVFTKASC4CH52R2T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00225232"
effective: "2025-05-16T13:45:00-05:00"
recorded: "2025-05-16T17:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Pt doing OK, no new symptoms.
BP 140/85, repeat 138/85, pulse 64, wt 184 lb.
Labs 5/12: eGFR 88, K 4.2, UACR 202 mg/g, A1c 8.3%.
Dapagliflozin started 10 mg daily today (A1c 8.3). Amlodipine started 5 mg daily today (BP above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051636",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051636",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-051636",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
