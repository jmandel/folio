---
folio: "0.1"
id: "01EWBTPMW0H2V8863VX8J1TPHB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226578"
effective: "2021-01-18T10:30:00-06:00"
recorded: "2021-01-18T16:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 146/93, repeat 142/90. Pulse 67, wt 256 lb.
Today: eGFR 61, K 4.4, UACR 184 mg/g, A1c 7.4%, LDL 80 mg/dL.
BP above goal. Lisinopril dose changed to 20 mg daily today.
Diet and activity reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-011833",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-011833",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
