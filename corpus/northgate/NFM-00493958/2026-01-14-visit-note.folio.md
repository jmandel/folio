---
folio: "0.1"
id: "01KEYVA5C0DER7RFWR7FNG5M3R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2026-01-14T10:15:00-06:00"
recorded: "2026-01-14T12:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 122/75, pulse 80, wt 183 lb.
Labs 1/8: eGFR 41, K 4.5, A1c 9.2%.
A1c up from last check. Reviewed diet and adherence with pt.
BP at goal. Repeat A1c in 3 mo.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-011488",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-011488",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-011488",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
