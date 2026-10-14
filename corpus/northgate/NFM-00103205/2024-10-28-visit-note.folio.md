---
folio: "0.1"
id: "01JB9YHGX0VXWAC710FA1MP3KD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2024-10-28T08:30:00-05:00"
recorded: "2024-10-28T11:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 124/76, pulse 76, wt 203 lb.
Labs today: eGFR 61, K 4.3, UACR 757 mg/g, A1c 6.3%.
eGFR down and UACR higher than before, discussed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102819",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-102819",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
