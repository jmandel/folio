---
folio: "0.1"
id: "01KAJ1KDQ0MCWE4KRZ3D2SCYCN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00129076"
effective: "2025-11-20T14:50:00-06:00"
recorded: "2025-11-20T19:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 132/75, pulse 75, wt 186 lb.
eGFR 66 today, K 4.2.
BP much better, pt doing well.
RTC at next annual exam.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-112098",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-112098",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
