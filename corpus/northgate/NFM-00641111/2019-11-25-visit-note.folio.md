---
folio: "0.1"
id: "01DTHT2ZD07SZ0DXNH62CYJG4S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00641111"
effective: "2019-11-25T09:30:00-06:00"
recorded: "2019-11-25T11:35:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 149/88, pulse 74, wt 220 lb.

Today: eGFR 76, K 4.2, UACR 8 mg/g, A1c 6.9%, LDL 146 mg/dL.

BP above goal, so lisinopril dose changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-112598",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-112598",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
