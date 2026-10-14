---
folio: "0.1"
id: "01K6NSF370FJYK07QG6Z3ZJYTR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00079819"
effective: "2025-10-03T12:30:00-05:00"
recorded: "2025-10-03T14:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 140/87, repeat 137/86, pulse 75, wt 166 lb.
Labs today: eGFR 89, K 4.6, A1c 6.4%, UACR 162 mg/g, LDL 137 mg/dL.
BP above goal. Losartan dose changed to 100 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-100382",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-100382",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
