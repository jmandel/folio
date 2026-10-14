---
folio: "0.1"
id: "01G90GMWN0NK3HW6H138AKGXJ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00801357"
effective: "2022-07-27T11:20:00-05:00"
recorded: "2022-07-27T14:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 144/90, pulse 88, wt 244 lb.
eGFR 56, A1c 7.3% today. K 6.4 on first draw, hemolyzed; K 4.5 today.
CKD stage 3a on problem list.
Lisinopril dose changed to 20 mg daily today (BP above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-072716",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-072716",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
