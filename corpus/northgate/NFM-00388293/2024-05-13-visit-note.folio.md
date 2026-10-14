---
folio: "0.1"
id: "01HXSRH3A0X47XCYAKZV3VXCPB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00388293"
effective: "2024-05-13T11:45:00-05:00"
recorded: "2024-05-13T14:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 113/70, pulse 65, wt 163 lb.
5/10 labs: eGFR 69, K 4.5, UACR 162 mg/g, A1c 7.1%, LDL 122.
LDL higher than last check; diet reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051311",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051311",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
