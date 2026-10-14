---
folio: "0.1"
id: "01FX1C0SV0H811T128WJV22SMR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770230"
effective: "2022-02-28T13:10:00-06:00"
recorded: "2022-02-28T17:53:00-06:00"
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
BP 111/70, pulse 87, wt 173 lb.
Labs 2/25: eGFR 63, K 4.6, A1c 7.8%.
Referral to nephrology placed today. Meds continue.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-022871",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-022871",
    "rank": 1,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
