---
folio: "0.1"
id: "01GCEZHYR0EVTVN3VB8R17MTPM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084740"
effective: "2022-09-08T09:15:00-05:00"
recorded: "2022-09-08T11:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Pt doing well, no new symptoms.
BP 131/88, pulse 65, wt 193 lb.
eGFR 61, K 4.1, UACR 351 mg/g, A1c 7.8% today.
Discussed diet and activity.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-090849",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-090849",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
