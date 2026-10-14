---
folio: "0.1"
id: "01HHD6ME60MAMPBCYVHC1RWJM9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00788538"
effective: "2023-12-11T09:15:00-06:00"
recorded: "2023-12-11T13:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 145/79, pulse 78, wt 176 lb.
Labs 12/5: eGFR 84, K 4.1, A1c 7.6%.
BP still above goal. Lisinopril dose changed to 40 mg daily today.
Pt voiced understanding. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-121127",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-121127",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
