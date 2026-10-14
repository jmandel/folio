---
folio: "0.1"
id: "01J6WV1NQ0TENXD53T63SA94K9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00004878"
effective: "2024-09-03T14:15:00-05:00"
recorded: "2024-09-03T16:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well, no complaints.
BP 131/78, pulse 74, wt 186 lb.
9/1 labs: eGFR 73, K 4.4, UACR 67 mg/g, A1c 6.3%.
BP and A1c at goal. UACR still elevated, will keep watching.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-090341",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-090341",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-090341",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
