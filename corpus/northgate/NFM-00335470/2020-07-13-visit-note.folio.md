---
folio: "0.1"
id: "01ED4S9470GP83YMVG98SBQ30N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00335470"
effective: "2020-07-13T08:50:00-05:00"
recorded: "2020-07-13T14:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new complaints.
BP 136/75, pulse 67, wt 216 lb.
Labs today: eGFR 67, K 4.5, UACR 192 mg/g, A1c 7.1%.
Reviewed results with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-071333",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-071333",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
