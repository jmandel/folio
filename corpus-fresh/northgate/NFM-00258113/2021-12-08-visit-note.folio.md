---
folio: "0.1"
id: "01FPDXDDY06XRV89CF99CX63NC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2021-12-08T09:50:00-06:00"
recorded: "2021-12-08T14:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 129/72, pulse 73, wt 168 lb.
Today: eGFR 60, K 4.1, A1c 7.4%.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-120825",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
