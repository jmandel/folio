---
folio: "0.1"
id: "01GVDY3S90NCVVCT5BW5NPRFSY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00743670"
effective: "2023-03-13T10:00:00-05:00"
recorded: "2023-03-13T11:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Feels well, no complaints today.
BP 123/79, pulse 81, wt 213 lb.
eGFR 91 and K 4.2 today. LDL 69 mg/dL.
Labs reviewed with pt. Records to be requested from prior office.
RTC for f/u, sooner prn.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-031393",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-031393",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
