---
folio: "0.1"
id: "01JJQ68PP0CR4H21DESG1SWJ8W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00020574"
effective: "2025-01-28T11:10:00-06:00"
recorded: "2025-01-28T13:30:00-06:00"
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
BP 153/97, repeat 148/93, pulse 74, wt 213 lb.
eGFR 81, K 4.5, A1c 7.1%, LDL 89 mg/dL today.
BP above goal, lisinopril dose changed to 40 mg daily today.
RTC 3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-012864",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-012864",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-012864",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
