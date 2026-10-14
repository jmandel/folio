---
folio: "0.1"
id: "01JKRRVXA037ZXVW8HYWEDZ2SV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00743780"
effective: "2025-02-10T09:40:00-06:00"
recorded: "2025-02-10T14:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing ok, no new symptoms.

BP 130/70, pulse 76, wt 137 lb.
Labs 2/8: eGFR 84, K 4, UACR 177 mg/g, A1c 7.6%.

Went over results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021093",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-021093",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
