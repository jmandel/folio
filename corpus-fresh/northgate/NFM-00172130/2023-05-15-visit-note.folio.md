---
folio: "0.1"
id: "01H0GHP2A0W82VRTF561Q6ZQTH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2023-05-15T11:10:00-05:00"
recorded: "2023-05-15T15:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes f/u. BP 146/93, repeat 142/92, pulse 77, wt 221 lb.
5/9 labs: A1c 6.6%, eGFR 42, K 4.7, LDL 155.
Chlorthalidone: started 12.5 mg daily today (BP above goal). Pt aware to report dizziness or cramps.
Recheck BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051535",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051535",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
