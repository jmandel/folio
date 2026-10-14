---
folio: "0.1"
id: "01GYTFAZA00BJ9WXPCBAK3ZQPZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2023-04-24T13:30:00-05:00"
recorded: "2023-04-24T15:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u after AKI. Feels back to baseline.
BP 146/78, repeat 144/75, pulse 84, wt 181 lb.
Hydrochlorothiazide resumed today (creatinine back to baseline). Losartan resumed today (creatinine back to baseline).
Recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-042456",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-042456",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
