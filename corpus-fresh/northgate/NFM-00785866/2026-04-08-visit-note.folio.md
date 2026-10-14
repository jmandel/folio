---
folio: "0.1"
id: "01KNPY3Z30DG3CN48SYX0QDRJB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2026-04-08T08:45:00-05:00"
recorded: "2026-04-08T11:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 135/84, pulse 73, wt 156 lb.

Labs 4/4: A1c 6.5%, eGFR 44, K 4.7, UACR 92 mg/g, LDL 101.

Pt doing well, no new complaints. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-040855",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-040855",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-040855",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
