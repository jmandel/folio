---
folio: "0.1"
id: "01J1D9C1Q0DTH2SFX6SN9VHSAF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00297732"
effective: "2024-06-27T08:15:00-05:00"
recorded: "2024-06-27T11:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new concerns today.

BP 107/65, pulse 76, wt 203 lb.

Labs today: eGFR 81, K 4, LDL 102 mg/dL.

Results reviewed with pt.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062727",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
