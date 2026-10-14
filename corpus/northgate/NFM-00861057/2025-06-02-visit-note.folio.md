---
folio: "0.1"
id: "01JWSCMYQ0XWC27G9Z8HQFTTDK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861057"
effective: "2025-06-02T13:15:00-05:00"
recorded: "2025-06-02T17:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well overall.
BP 144/83, pulse 73, wt 162 lb.
5/28 labs: eGFR 71, K 4.2, LDL 87 mg/dL.
BP above goal, amlodipine started 5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-060215",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-060215",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
