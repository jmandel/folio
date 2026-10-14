---
folio: "0.1"
id: "01J5QZ6KKG4PKWDBFH854354SV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00171449"
effective: "2024-08-20T08:21:00-05:00"
recorded: "2024-08-20T08:21:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.3. Start glargine 10 units at bedtime.</ref> Pt taught pen use.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-37751",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2024-082098"
  }
}
```
