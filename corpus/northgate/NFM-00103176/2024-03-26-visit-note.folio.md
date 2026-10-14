---
folio: "0.1"
id: "01HSY84N7099RDHWZTPVG4W0NK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103176"
effective: "2024-03-26T11:15:00-05:00"
recorded: "2024-03-26T15:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 154/90, repeat 152/88. Pulse 86, wt 175 lb.

Labs today: eGFR 95, K 4.7, UACR 246 mg/g, A1c 7.5%, LDL 58 mg/dL.

BP above goal, so chlorthalidone started 12.5 mg daily today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-032696",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-032696",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
