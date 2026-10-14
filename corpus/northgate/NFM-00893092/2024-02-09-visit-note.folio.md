---
folio: "0.1"
id: "01HP7A9HQ0KSJ2NT409BQ1JEJX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00893092"
effective: "2024-02-09T08:15:00-06:00"
recorded: "2024-02-09T10:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 131/80, pulse 69, wt 154 lb.
eGFR 73, K 4.2, LDL 80 mg/dL today.
Labs reviewed with pt.
RTC 1 yr, sooner prn.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-020952",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-020952",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-020952",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-020952",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
