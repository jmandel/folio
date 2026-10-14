---
folio: "0.1"
id: "01J6X8KME03S2VXRRYQZN9BJNF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00146853"
effective: "2024-09-03T14:00:00-05:00"
recorded: "2024-09-03T19:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 141/84, pulse 72, wt 184 lb.
eGFR 80 today. K 6.3 on first draw, hemolyzed; repeat K 4.8.
BP above goal, so lisinopril dose changed to 40 mg daily today.
RTC 3 mo, BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-090346",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-090346",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
