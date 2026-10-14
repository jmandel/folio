---
folio: "0.1"
id: "01KKVW7WQ07MF532R0K2PS6K0Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00963357"
effective: "2026-03-16T08:45:00-05:00"
recorded: "2026-03-16T12:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 131/79, pulse 72, wt 193 lb.

Patient ran out of losartan about 3 weeks ago and has not been taking it.

Labs today: eGFR 81, K 4.2, UACR 14 mg/g, A1c 7.2%.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031676",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-031676",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-031676",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
