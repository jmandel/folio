---
folio: "0.1"
id: "01JNKY5VA08MQ69Z80KBTRZKR2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00070366"
effective: "2025-03-05T11:30:00-06:00"
recorded: "2025-03-05T13:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new symptoms.
BP 120/73, pulse 67, wt 190 lb.
3/3 labs: eGFR 76, K 4.2, LDL 83 mg/dL.
Reviewed results with pt, no changes today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-030516",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
