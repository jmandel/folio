---
folio: "0.1"
id: "01KVRCZ8P0FZTWMFGJ17ARWZZ5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00508445"
effective: "2026-06-22T10:10:00-05:00"
recorded: "2026-06-22T14:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 140/77, pulse 67, wt 253 lb.
Labs today: eGFR 50, K 4.4, LDL 144 mg/dL.
BP above goal, lisinopril changed to 20 mg daily today.
RTC 3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-062255",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-062255",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-062255",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
