---
folio: "0.1"
id: "01HY1D4VK0M7YK402PV31YXRX0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00725765"
effective: "2024-05-16T08:15:00-05:00"
recorded: "2024-05-16T14:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 140/81, pulse 85, wt 193 lb.

BP above goal. Losartan dose changed to 100 mg daily today.

Pt agrees, no side effects so far. Reminded about low salt diet.

RTC 3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051651",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051651",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
