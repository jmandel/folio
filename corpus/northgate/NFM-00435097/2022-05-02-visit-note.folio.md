---
folio: "0.1"
id: "01G23HZ9J0R1MMGZC17KFG2FYW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00435097"
effective: "2022-05-02T14:10:00-05:00"
recorded: "2022-05-02T18:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 150/94, repeat 142/92, pulse 72, wt 232 lb.
Today: eGFR 100, K 4.5, UACR 79 mg/g, A1c 6.8%.
BP above goal, chlorthalidone started 12.5 mg daily today.
Pt to watch for dizziness. RTC 1 mo for BP check and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-050251",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-050251",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
