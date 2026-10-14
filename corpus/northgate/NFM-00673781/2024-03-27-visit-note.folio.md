---
folio: "0.1"
id: "01HT0P2HX05W3X69VQ0RG020BA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673781"
effective: "2024-03-27T09:50:00-05:00"
recorded: "2024-03-27T14:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 146/91, repeat 138/91. Pulse 80, wt 212 lb.
Labs 3/21: eGFR 66, K 4.5, A1c 8%.
Reviewed diet and activity.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-032779",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-032779",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
