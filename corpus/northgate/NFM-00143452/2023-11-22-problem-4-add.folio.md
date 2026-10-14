---
folio: "0.1"
id: "01HFWG0B10D6TS7GKS3J6N9GG9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00143452"
effective: "2023-11-22"
recorded: "2023-11-22T15:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Heart failure with reduced ejection fraction.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14052",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2023-112212"
  }
}
```
