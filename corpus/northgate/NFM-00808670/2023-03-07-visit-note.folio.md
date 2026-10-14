---
folio: "0.1"
id: "01GTYW14Y0CZQAD67KJ4X0NDX4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00808670"
effective: "2023-03-07T10:30:00-06:00"
recorded: "2023-03-07T14:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History reviewed with pt.
BP 146/89, pulse 82, wt 225 lb.
eGFR 59, K 3.9 today.
LDL 90 mg/dL today.
BP above goal, will recheck at next visit. Problem list entered from pt history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-030795",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-030795",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
