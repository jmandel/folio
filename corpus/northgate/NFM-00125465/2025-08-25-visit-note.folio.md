---
folio: "0.1"
id: "01K3HTKT708JT6HFJAZJP8B5JG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00125465"
effective: "2025-08-25T14:40:00-05:00"
recorded: "2025-08-25T18:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK, no new complaints.

BP 142/84, repeat 134/84. Pulse 85, wt 245 lb.

eGFR 76, K 4.2 today.

Chlorthalidone started 12.5 mg daily today, BP above goal. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-082521",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-082521",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
