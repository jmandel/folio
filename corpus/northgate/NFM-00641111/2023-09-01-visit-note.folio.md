---
folio: "0.1"
id: "01H992HK00X5MSHYH3RDWY6ZX9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00641111"
effective: "2023-09-01T08:00:00-05:00"
recorded: "2023-09-01T14:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 144/92, pulse 85, wt 217 lb.

Labs 8/30: eGFR 79, K 4.2, UACR 13 mg/g, A1c 8%.

BP high today, will recheck at next visit. Reviewed diet with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-090148",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-090148",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
