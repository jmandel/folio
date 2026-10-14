---
folio: "0.1"
id: "01D07FMA5G2YFCJSVQZ9YJGR2J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2019-01-02T08:31:00-06:00"
recorded: "2019-01-02T08:31:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.4. Metformin dose changed to 1000 mg BID.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-12554",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "A1c 8.4",
    "visit_id": "V-2019-010214"
  }
}
```
