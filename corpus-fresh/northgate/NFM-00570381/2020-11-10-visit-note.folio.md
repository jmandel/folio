---
folio: "0.1"
id: "01EPT09R701BMFWAWPJTBDJJ8Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2020-11-10T10:20:00-06:00"
recorded: "2020-11-10T15:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN, DM2 and obesity per pt.
BP 131/72, pulse 71, wt 225 lb.
Labs today: eGFR 94, K 4.3, UACR 356 mg/g, A1c 7.3%, LDL 200 mg/dL.
Reviewed results with pt. Will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-111033",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-111033",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
