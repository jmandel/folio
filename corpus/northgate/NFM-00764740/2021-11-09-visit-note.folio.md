---
folio: "0.1"
id: "01FM39NBB01SBVK8GYBDPNV52A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00764740"
effective: "2021-11-09T12:00:00-06:00"
recorded: "2021-11-09T15:29:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 122/71, pulse 83, wt 210 lb.

Labs today: eGFR 63, K 4.3, LDL 52 mg/dL.

Questions answered. RTC for annual exam.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110923",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
