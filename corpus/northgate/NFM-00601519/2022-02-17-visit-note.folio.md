---
folio: "0.1"
id: "01FW4RYJK0PB60WZMDX3M3XQ19"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2022-02-17T10:00:00-06:00"
recorded: "2022-02-17T15:21:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 141/89, pulse 69, wt 167 lb.
Labs 2/12: eGFR 47, K 4.5, UACR 160 mg/g, A1c 7.3%, LDL 68 mg/dL.
BP above goal. Losartan dose changed to 100 mg daily today.
RTC 3 mo, BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-021798",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-021798",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-021798",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
