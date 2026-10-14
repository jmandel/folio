---
folio: "0.1"
id: "01HWV89FB0D13YS7WMT56C113S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2024-05-01T15:50:00-05:00"
recorded: "2024-05-01T18:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well.

BP 142/84, repeat 140/84, pulse 63, wt 173 lb.

Labs today: eGFR 74, UACR 9 mg/g, A1c 7.2%. K 6 on first draw, hemolyzed; repeat K 4.5.

<ref id="sick_day">Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink.</ref>

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-050162",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-050162",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
