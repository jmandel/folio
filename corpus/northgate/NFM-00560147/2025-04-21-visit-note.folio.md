---
folio: "0.1"
id: "01JSDF7A40ME9F3N50PN7YK084"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00560147"
effective: "2025-04-21T14:10:00-05:00"
recorded: "2025-04-21T19:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels fine, no weakness or palpitations.
BP 138/84, pulse 88, wt 187 lb.
eGFR 77 today. K 6.6 on first draw, sample hemolyzed. Repeat K 4.1 today.
LDL 123 mg/dL today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-042128",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-042128",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
