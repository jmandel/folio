---
folio: "0.1"
id: "01HACVDAR0RZ2TQBKWJZRH7Y43"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00575599"
effective: "2023-09-15T08:20:00-05:00"
recorded: "2023-09-15T11:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No new symptoms.
BP 139/79, pulse 83, wt 160 lb.
eGFR 74, K 4.2, LDL 81 mg/dL today.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-091583",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-091583",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
