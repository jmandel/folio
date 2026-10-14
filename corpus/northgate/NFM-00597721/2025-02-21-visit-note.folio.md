---
folio: "0.1"
id: "01JMMY4VF0EGRHFA8KCR9SSZWC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00597721"
effective: "2025-02-21T08:45:00-06:00"
recorded: "2025-02-21T13:01:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 140/85, repeat 137/85, pulse 86, wt 277 lb.
eGFR 95 today, K 4.5.
Lisinopril dose changed to 20 mg daily today (BP above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-022122",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-022122",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
