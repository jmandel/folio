---
folio: "0.1"
id: "01HRWMSMW036GMDJ0ZZNR9EAR4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00830635"
effective: "2024-03-13T11:50:00-05:00"
recorded: "2024-03-13T14:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt reports ongoing dry cough.
BP 136/81, pulse 78, wt 257 lb.
Labs today: eGFR 72, K 4.4, LDL 74 mg/dL.
Lisinopril stopped today (dry cough). Losartan started 50 mg daily today (ACE inhibitor cough). Lisinopril intolerance: dry cough.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031362",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031362",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
