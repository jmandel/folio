---
folio: "0.1"
id: "01E4F7XMG0TDRJPMYKEVNHA1XH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00850967"
effective: "2020-03-27T14:15:00-05:00"
recorded: "2020-03-27T19:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 131/81, pulse 88, wt 220 lb.
Labs 3/21: eGFR 69, K 4.4, UACR 15 mg/g, A1c 7.9%.
Reviewed results with pt. Diet and activity discussed.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-032796",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-032796",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-032796",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
