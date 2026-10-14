---
folio: "0.1"
id: "01JBFM12PGY69GHCXM80BHS4VD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00438305"
effective: "2024-10-30T16:06:00-05:00"
recorded: "2024-10-30T16:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Losartan started 50 mg daily today, BP above goal.</ref> Pt to recheck BP at home.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-18587",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2024-103032"
  }
}
```
