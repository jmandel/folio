---
folio: "0.1"
id: "01F4834GR0RCFVM32J5QE7KG37"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00271285"
effective: "2021-04-26T12:50:00-05:00"
recorded: "2021-04-26T17:00:00-05:00"
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
BP 145/91, repeat 140/87, pulse 68, wt 180 lb.
4/21 labs: eGFR 70, A1c 8.4%. K 5.8 was hemolyzed, repeat K 4.5.
A1c 8.4 so metformin dose changed to 1000 mg twice daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-042644",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-042644",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-042644",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
