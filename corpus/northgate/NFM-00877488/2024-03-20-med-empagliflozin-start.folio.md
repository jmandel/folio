---
folio: "0.1"
id: "01HSE7TNSG561Y3N9T7VG8ASQV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877488"
effective: "2024-03-20T10:31:00-05:00"
recorded: "2024-03-20T10:31:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Empagliflozin 10 mg daily started today for HFrEF.</ref> Reviewed what to expect with pt.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-25006",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "HFrEF",
    "visit_id": "V-2024-032071"
  }
}
```
