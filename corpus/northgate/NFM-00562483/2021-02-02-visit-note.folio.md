---
folio: "0.1"
id: "01EXJK0K00N84HVSGSEVXNYRDC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00562483"
effective: "2021-02-02T11:30:00-06:00"
recorded: "2021-02-02T18:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No new symptoms.
BP 143/78, pulse 84, wt 163 lb.
eGFR 74, K 4.5 today.
BP still above goal. Pt to keep checking at home.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-020216",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-020216",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
