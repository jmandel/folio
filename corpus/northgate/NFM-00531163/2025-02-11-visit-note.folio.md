---
folio: "0.1"
id: "01JKVE9NS0NKXZG25Q7C508AW7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531163"
effective: "2025-02-11T10:50:00-06:00"
recorded: "2025-02-11T15:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no new concerns.

BP 136/88, pulse 87, wt 180 lb.
eGFR 71, K 4.5, UACR 59 mg/g, A1c 6.1% today.

Reviewed labs with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021161",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-021161",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
