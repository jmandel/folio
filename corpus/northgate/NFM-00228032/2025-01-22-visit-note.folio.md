---
folio: "0.1"
id: "01JJ7RZ5Z0TQP5YWHVV93MVFKJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00228032"
effective: "2025-01-22T10:00:00-06:00"
recorded: "2025-01-22T13:49:00-06:00"
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
BP 122/75, pulse 83, wt 202 lb.
1/16 labs: eGFR 65, K 4.3, UACR 10 mg/g, A1c 7.5%.
Results discussed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-012259",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-012259",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
