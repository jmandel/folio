---
folio: "0.1"
id: "01GAS3CKW0AX724TEDEHH5FHEQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927456"
effective: "2022-08-18T08:00:00-05:00"
recorded: "2022-08-18T13:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 143/84, repeat 140/81, pulse 68, wt 168 lb.
Labs today: eGFR 61, K 4.1, UACR 215 mg/g, A1c 6.8%, LDL 133 mg/dL.
Empagliflozin started 10 mg daily today for CKD + DM, cardiorenal benefit.
BP above goal, lisinopril changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-081825",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-081825",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-081825",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
