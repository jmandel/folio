---
folio: "0.1"
id: "01K5Y6KTF0XEMXQFG8SRDD62X6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00334426"
effective: "2025-09-24T08:45:00-05:00"
recorded: "2025-09-24T10:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 139/84, pulse 83, wt 189 lb.
eGFR 36, K 5.2, UACR 954 mg/g, A1c 9%, LDL 118 today.
A1c and UACR both up. Reviewed diet and adherence. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092437",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092437",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-092437",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
