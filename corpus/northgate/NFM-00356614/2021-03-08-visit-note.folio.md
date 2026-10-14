---
folio: "0.1"
id: "01F09WB630VBBAPY29WWDWRGD6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2021-03-08T11:50:00-06:00"
recorded: "2021-03-08T15:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new complaints.
BP 136/80, pulse 83, wt 235 lb.
eGFR 64, K 4.6, UACR 259 mg/g, A1c 7.9%, LDL 175 mg/dL today.
Reviewed labs with pt. Diet and activity discussed.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-030877",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-030877",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
