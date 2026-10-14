---
folio: "0.1"
id: "01KKCCN4801JABYDF64B729WPB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00977838"
effective: "2026-03-10T08:20:00-05:00"
recorded: "2026-03-10T12:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no complaints.

BP 142/86, repeat 140/82, pulse 79, wt 230 lb.

BP above goal, losartan dose changed to 100 mg daily today.

RTC 3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031017",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-031017",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-031017",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
