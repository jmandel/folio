---
folio: "0.1"
id: "01K2Z5AN400C8W2H3QWMZR9JFH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2025-08-18T08:31:00-05:00"
recorded: "2025-08-18T12:58:40-05:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "a1c": {
    "type": "imported_result",
    "test": { "nfm_code": "A1C", "name": "Hemoglobin A1c", "loinc": "4548-4" },
    "value": "8.6",
    "unit": "%",
    "reference_range": "4.0-5.6",
    "flag": "H",
    "result_status": "F",
    "collected": "2025-08-18T08:31:00-05:00",
    "resulted": "2025-08-18T11:20:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-230-00157", "result_code": "LK-A1C" },
    "order_id": "NO-2025-80412"
  },
  "wbc": {
    "type": "imported_result",
    "test": { "nfm_code": "WBC", "name": "White blood cell count", "loinc": "6690-2" },
    "value": "6800",
    "unit": "cells/uL",
    "reference_range": "3400-10800",
    "result_status": "F",
    "collected": "2025-08-18T08:31:00-05:00",
    "resulted": "2025-08-18T10:12:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-230-00157", "result_code": "LK-WBC" },
    "order_id": "NO-2025-80413"
  },
  "hgb": {
    "type": "imported_result",
    "test": { "nfm_code": "HGB", "name": "Hemoglobin", "loinc": "718-7" },
    "value": "12.1",
    "unit": "g/dL",
    "reference_range": "11.1-15.9",
    "result_status": "F",
    "collected": "2025-08-18T08:31:00-05:00",
    "resulted": "2025-08-18T10:12:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-230-00157", "result_code": "LK-HGB" },
    "order_id": "NO-2025-80413"
  },
  "plt": {
    "type": "imported_result",
    "test": { "nfm_code": "PLT", "name": "Platelet count", "loinc": "777-3" },
    "value": "212000",
    "unit": "cells/uL",
    "reference_range": "150000-450000",
    "result_status": "F",
    "collected": "2025-08-18T08:31:00-05:00",
    "resulted": "2025-08-18T10:12:00-05:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV25-230-00157", "result_code": "LK-PLT" },
    "order_id": "NO-2025-80413"
  }
}
```
