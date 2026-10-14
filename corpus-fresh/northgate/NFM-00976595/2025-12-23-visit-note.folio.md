---
folio: "0.1"
id: "01KD6J2CQ01SBBDABC43ENH2Y4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976595"
effective: "2025-12-23T11:45:00-06:00"
recorded: "2025-12-23T15:33:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No complaints.
BP 141/90, repeat 134/89, pulse 83, wt 141 lb.
12/18 labs: eGFR 71, K 4.2.
BP still above goal. Losartan dose changed to 100 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-122374",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-122374",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
