---
folio: "0.1"
id: "01GCSN44C0YRN0HV2WB2TJQZ2H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2022-09-12T08:05:00-05:00"
recorded: "2022-09-12T15:09:20-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01GCS9AFD894DK0R4CSZ74JM78"
---

```json payload
{
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2022-09-12T08:05:00-05:00",
    "resulted": "2022-09-12T15:05:00-05:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 11:46. CORRECTED 09/12/22 15:05: result invalidated, see recollected specimen LV22-255-00688.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV22-255-00412", "result_code": "LK-K" },
    "order_id": "NO-2022-61873"
  }
}
```
