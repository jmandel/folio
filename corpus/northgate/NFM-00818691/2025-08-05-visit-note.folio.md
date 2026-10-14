---
folio: "0.1"
id: "01K1XYPR40RP1GGGKWNKR93SPP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00818691"
effective: "2025-08-05T12:15:00-05:00"
recorded: "2025-08-05T15:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no complaints.
BP 145/83, pulse 83, wt 188 lb.
eGFR 80, K 4.5, LDL 122 mg/dL today.
BP above goal, chlorthalidone started 12.5 mg daily today.
Recheck BMP at f/u. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-080571",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-080571",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-080571",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
