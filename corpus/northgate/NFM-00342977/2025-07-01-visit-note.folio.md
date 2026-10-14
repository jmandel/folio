---
folio: "0.1"
id: "01JZ3XA580H3D5C690DDDVFRA4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2025-07-01T11:45:00-05:00"
recorded: "2025-07-01T16:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic DKA associated with the SGLT2 inhibitor. Feels back to baseline.
BP 142/78, repeat 138/75, pulse 73, wt 177 lb.
Dapagliflozin stopped today, entered as adverse reaction (euglycemic diabetic ketoacidosis).
<ref id="sick_day">Sick-day rules reviewed.</ref>
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070145",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-070145",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-070145",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
