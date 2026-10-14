---
folio: "0.1"
id: "01HK3DSPS0DZEMAFVGZS4TPM00"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00623675"
effective: "2024-01-01T15:10:00-06:00"
recorded: "2024-01-01T15:10:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "review": {
    "type": "list_reviewed",
    "list": "problems",
    "lines_on_list": ["PL-13319", "PL-14188", "PL-18023", "PL-11351", "PL-19323"],
    "visit_id": "V-2024-010182"
  }
}
```
