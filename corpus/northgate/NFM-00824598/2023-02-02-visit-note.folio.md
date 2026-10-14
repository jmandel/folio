---
folio: "0.1"
id: "01GR9HZPH06DCV2YTMJQ2PHV56"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00824598"
effective: "2023-02-02T08:00:00-06:00"
recorded: "2023-02-02T11:15:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt feels well.
BP 123/74, pulse 72, wt 262 lb.
Labs 1/28: eGFR 64, A1c 6.9%.
Reviewed results with pt, diet and exercise reinforced.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020237",
    "visit_type": "office",
    "reason": "Chronic care visit"
  }
}
```
