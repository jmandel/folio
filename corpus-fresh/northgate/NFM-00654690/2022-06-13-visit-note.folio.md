---
folio: "0.1"
id: "01G5FMKJ60CSBBD8ZSFYQYQXQ5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2022-06-13T13:00:00-05:00"
recorded: "2022-06-13T17:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 140/89, repeat 132/89. Pulse 76, wt 240 lb.
Labs 6/9: eGFR 89, K 4.4, A1c 7.2%.
BP above goal. Chlorthalidone started 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-061341",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-061341",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
