---
folio: "0.1"
id: "01HB6T8SJGWMAHAQSBDY1N40BP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2023-09-25T13:40:00-05:00"
recorded: "2023-09-25T13:40:18-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="alg_1">Euglycemic DKA on empagliflozin, admitted to hospital.</ref>

```json payload
{
  "alg_1": {
    "type": "allergy_event",
    "allergy_id": "AL-2938",
    "action": "add",
    "substance": { "name": "empagliflozin", "rxnorm": "1545653" },
    "reaction_type": "adverse_reaction",
    "reactions": ["Diabetic ketoacidosis"],
    "severity": "high",
    "onset": { "date": "2023-09-12", "precision": "day" },
    "visit_id": "V-2023-092594"
  }
}
```
