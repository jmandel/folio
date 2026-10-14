---
folio: "0.1"
id: "01DXYB7S8GTDVK3ZSTMGC84QMC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2020-01-06T15:12:00-06:00"
recorded: "2020-01-06T15:12:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.3. Start insulin glargine 10 units QHS.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43494",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2020-010675"
  }
}
```
