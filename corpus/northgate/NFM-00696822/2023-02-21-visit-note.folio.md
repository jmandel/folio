---
folio: "0.1"
id: "01GSV283P0WN6AHYMPTHGPG2R2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696822"
effective: "2023-02-21T11:40:00-06:00"
recorded: "2023-02-21T16:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx HTN, DM2 and hyperlipidemia per pt.
BP 146/93, pulse 79, wt 200 lb.
Labs today: eGFR 44, K 4.7, UACR 7 mg/g, A1c 7.7%, LDL 90.
Reduced eGFR noted, nephrology referral placed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-022166",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-022166",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
