---
folio: "0.1"
id: "01GPP28MX0ZZATTQ7VKPENCCJX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00334426"
effective: "2023-01-13T08:15:00-06:00"
recorded: "2023-01-13T11:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2 and knee OA per pt.
BP 137/81, pulse 74, wt 187 lb.
Labs 1/9: eGFR 38, K 4.7, UACR 430 mg/g, A1c 7.6%, LDL 103.
Metformin changed to 500 mg BID today (eGFR 40).
Nephrology referral placed for CKD. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011319",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011319",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-011319",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
