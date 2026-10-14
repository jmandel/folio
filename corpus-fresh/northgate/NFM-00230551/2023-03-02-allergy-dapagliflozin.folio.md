---
folio: "0.1"
id: "01GTHBD35G61G02BNM4K3WVKEE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2023-03-02T08:25:00-06:00"
recorded: "2023-03-02T08:25:18-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Euglycemic DKA on dapagliflozin, entered as adverse reaction.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-4913",
    "action": "add",
    "substance": { "name": "dapagliflozin", "rxnorm": "1488564" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2023-02-21", "precision": "day" },
    "visit_id": "V-2023-030289"
  }
}
```
