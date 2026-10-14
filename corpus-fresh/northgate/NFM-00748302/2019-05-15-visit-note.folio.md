---
folio: "0.1"
id: "01DAYEW4J0DMEZT9J2PDZVSA45"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2019-05-15T08:20:00-05:00"
recorded: "2019-05-15T14:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 145/90, pulse 70, wt 161 lb.
Today: eGFR 73, K 4.5, UACR 208 mg/g, A1c 8.2%.
Semaglutide started 0.5 mg weekly today (A1c 8.2).
BP above goal, lisinopril dose changed to 20 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-051589",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-051589",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
