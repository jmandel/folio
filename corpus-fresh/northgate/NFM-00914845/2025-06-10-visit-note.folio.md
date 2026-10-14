---
folio: "0.1"
id: "01JXDBZAP04QSEPJNYN45VG9Y4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00914845"
effective: "2025-06-10T09:45:00-05:00"
recorded: "2025-06-10T11:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well overall.
BP 112/64, pulse 80, wt 298 lb.
Labs 6/8: eGFR 84, LDL 111 mg/dL. Reviewed with pt.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061044",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-061044",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
