---
folio: "0.1"
id: "01GASN7X40RXVC9RCHBQ56645Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00846917"
effective: "2022-08-18T13:58:00-05:00"
recorded: "2022-08-18T18:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick, vomiting, not taking much by mouth.
Metformin held today (vomiting, poor oral intake); review 8/25.
Advised to sip fluids and call back if worse.
Pt agreed with plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-081876",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
