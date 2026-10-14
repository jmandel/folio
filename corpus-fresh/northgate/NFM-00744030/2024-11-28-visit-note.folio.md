---
folio: "0.1"
id: "01JDTH7TV0QHAMQ3EV6G00Y9W1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00744030"
effective: "2024-11-28T15:15:00-06:00"
recorded: "2024-11-28T17:21:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK overall.
BP 139/89, pulse 72, wt 219 lb.
Today eGFR 92, K 4.4, A1c 7.8%, LDL 81.
Discussed diet and exercise. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112818",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-112818",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
