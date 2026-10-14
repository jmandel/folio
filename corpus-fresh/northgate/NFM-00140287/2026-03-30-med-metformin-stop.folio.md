---
folio: "0.1"
id: "01KMZF2THGY34CKGB5MSS6ZTAM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2026-03-30T08:31:00-05:00"
recorded: "2026-03-30T08:31:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">eGFR 30. Metformin stopped.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-14458",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "stop_reason": "other",
    "reason_text": "eGFR 30",
    "visit_id": "V-2026-033058"
  }
}
```
