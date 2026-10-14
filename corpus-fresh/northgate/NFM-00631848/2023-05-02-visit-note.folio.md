---
folio: "0.1"
id: "01GZFDCM406NXNJEB4Z8YNRG77"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2023-05-02T14:10:00-05:00"
recorded: "2023-05-02T18:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Feeling well, no new symptoms.
BP 136/73, pulse 71, wt 222 lb.
Labs today: eGFR 73, K 4.2, LDL 107 mg/dL.
Reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-050246",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
