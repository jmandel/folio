---
folio: "0.1"
id: "01JQSZ8Y40K1B3BPBETS139A1X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00387375"
effective: "2025-04-01T14:20:00-05:00"
recorded: "2025-04-01T19:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints.
BP 140/92, repeat 137/89, pulse 75, wt 181 lb.
Today: eGFR 84, K 4.1, LDL 63 mg/dL.
BP up today, repeat still a little high. Will recheck at f/u.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-040162",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-040162",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-040162",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
