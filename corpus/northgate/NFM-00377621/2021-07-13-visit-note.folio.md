---
folio: "0.1"
id: "01FAGPBJ00TQD920DVAKTRXPSG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2021-07-13T13:10:00-05:00"
recorded: "2021-07-13T14:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well, no new complaints.
BP 134/81, pulse 73, wt 132 lb.
Labs 7/8: A1c 7.4%, eGFR 62, K 4.2, UACR 718 mg/g.
Referred to nephrology for CKD, pt agrees.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-071365",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
