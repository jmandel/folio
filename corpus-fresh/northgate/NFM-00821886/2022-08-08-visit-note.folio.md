---
folio: "0.1"
id: "01G9Z75XY08QEW4XVNGQF5Z7BF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2022-08-08T10:10:00-05:00"
recorded: "2022-08-08T12:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels fine.
BP 138/84, pulse 62, wt 186 lb.
eGFR 81, A1c 6.9%. K 5.9 on first draw but sample hemolyzed; repeat K 4.7.
No action needed on K. RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-080882",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-080882",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
