---
folio: "0.1"
id: "01GN8CCVS036059BSM4XPFN4W2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2022-12-26T14:30:00-06:00"
recorded: "2022-12-26T17:31:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 120/74, pulse 75, wt 229 lb.
eGFR 63, K 4.6, UACR 870 mg/g, A1c 7.9% today.
Discussed labs and diet. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-122647",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-122647",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
