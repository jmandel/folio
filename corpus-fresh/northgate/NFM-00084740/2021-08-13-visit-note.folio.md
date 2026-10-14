---
folio: "0.1"
id: "01FD0DJYY0VT7T1ZAJFPX477RF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084740"
effective: "2021-08-13T09:50:00-05:00"
recorded: "2021-08-13T13:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 146/80, repeat 140/76, pulse 62, wt 194 lb. Feels well, no new complaints.

Labs today: A1c 7.3%, eGFR 65, K 4.3, UACR 368 mg/g.

BP above goal, lisinopril increased to 40 mg daily today.

Discussed home BP log. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-081319",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-081319",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-081319",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
