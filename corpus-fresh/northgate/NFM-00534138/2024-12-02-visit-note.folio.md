---
folio: "0.1"
id: "01JE483YP0QYT18TW2F26WC3K8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00534138"
effective: "2024-12-02T08:10:00-06:00"
recorded: "2024-12-02T11:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 131/78, pulse 63, wt 192 lb.
eGFR 55, K 4.8, UACR 97 mg/g today.
Pt feels well. Reviewed labs, will watch K and kidney numbers.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120232",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-120232",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
