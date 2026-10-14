---
folio: "0.1"
id: "01GYZVXE20MV38CASS6KYKJYSA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2023-04-26T14:15:00-05:00"
recorded: "2023-04-26T17:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 156/93, pulse 77, wt 220 lb.
Today: eGFR 63, K 4, A1c 7.3%.
BP above goal, losartan started 50 mg daily today.
RTC 2 mo for BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-042694",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-042694",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-042694",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
