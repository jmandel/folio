---
folio: "0.1"
id: "01FECCPDV0Q50B8HZBH3MT8AEF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2021-08-30T10:00:00-05:00"
recorded: "2021-08-30T15:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 128/81, pulse 85, wt 214 lb.
A1c 7.2%, eGFR 68, K 4.4. UACR 675 mg/g today, still rising.
Referring to nephrology. Pt agrees.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-083084",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-083084",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
