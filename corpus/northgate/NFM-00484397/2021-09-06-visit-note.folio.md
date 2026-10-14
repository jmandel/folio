---
folio: "0.1"
id: "01FEYFPW00BEK6RFRC3646HWY5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2021-09-06T14:10:00-05:00"
recorded: "2021-09-06T16:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, not keeping much down.
Poor oral intake. Advised small sips of fluids.
Lisinopril held today (vomiting, poor oral intake). Review 9/13.
Call back or seek care if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-090642",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
