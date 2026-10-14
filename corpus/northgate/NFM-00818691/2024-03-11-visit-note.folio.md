---
folio: "0.1"
id: "01HRR59BR01PNP8F3BTEWVAZY7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00818691"
effective: "2024-03-11T14:15:00-05:00"
recorded: "2024-03-11T20:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 149/92, pulse 79, wt 189 lb.
Labs today: eGFR 82, K 4.5, LDL 143 mg/dL.
BP elevated today, will recheck at next visit. Lifestyle and diet reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031123",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031123",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
