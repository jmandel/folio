---
folio: "0.1"
id: "01FEKZ88R005PRYSZX8GGDTPTW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2021-09-02T08:15:00-05:00"
recorded: "2021-09-02T14:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no complaints.
BP 158/89, repeat 150/89. Pulse 63, wt 188 lb.
Labs 8/31: eGFR 70, K 4.2, A1c 6.9%.
Lisinopril: dose changed to 20 mg daily today (BP above goal).
RTC 3 mo, recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-090226",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-090226",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
