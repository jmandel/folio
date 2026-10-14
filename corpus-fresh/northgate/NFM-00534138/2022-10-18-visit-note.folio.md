---
folio: "0.1"
id: "01GFPJGEF0E4ZQZRXF17WD89E6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00534138"
effective: "2022-10-18T12:20:00-05:00"
recorded: "2022-10-18T17:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 130/78, pulse 67, wt 195 lb.
Today: eGFR 60, K 4.2, UACR 97 mg/g, LDL 69 mg/dL.
No new complaints. Reviewed labs with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-101871",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-101871",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-101871",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
