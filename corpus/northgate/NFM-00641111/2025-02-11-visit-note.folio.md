---
folio: "0.1"
id: "01JKVKV9C01Y072N2604HCKVS2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00641111"
effective: "2025-02-11T11:20:00-06:00"
recorded: "2025-02-11T17:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 129/79, pulse 66, wt 216 lb.

Labs today: eGFR 74, K 4.9, UACR 12 mg/g, A1c 7.6%, LDL 150 mg/dL.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021162",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-021162",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
