---
folio: "0.1"
id: "01J87Z7ZZGFD9QF238Y2SR6GQ5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00507463"
effective: "2024-09-20T10:01:00-05:00"
recorded: "2024-09-20T10:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Losartan increased to 100 mg daily.</ref> Pt aware.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-39640",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2024-092024"
  }
}
```
