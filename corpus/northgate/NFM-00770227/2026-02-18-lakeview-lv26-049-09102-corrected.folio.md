---
folio: "0.1"
id: "01KHS7EZW0XKZEM9PQ05JW150C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770227"
effective: "2026-02-18T07:21:00-06:00"
recorded: "2026-02-18T14:36:00-06:00"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
supersedes:
  - "01KHRR48R0RTKAG1J4PS348TEA"
---

```json payload
{
  "creat": {
    "type": "imported_result",
    "test": { "nfm_code": "CREAT", "name": "Creatinine, serum", "loinc": "2160-0" },
    "value": "0.86",
    "unit": "mg/dL",
    "reference_range": "0.57-1.00",
    "result_status": "F",
    "collected": "2026-02-18T07:21:00-06:00",
    "resulted": "2026-02-18T09:57:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-049-09102", "result_code": "LK-CREAT" },
    "order_id": "NO-2026-60345"
  },
  "egfr": {
    "type": "imported_result",
    "test": { "nfm_code": "EGFR", "name": "eGFR (CKD-EPI 2021)" },
    "value": "84",
    "unit": "mL/min/1.73m2",
    "reference_range": ">59",
    "result_status": "F",
    "collected": "2026-02-18T07:21:00-06:00",
    "resulted": "2026-02-18T09:57:00-06:00",
    "comment": "Calculated by CKD-EPI 2021 (race-free) equation.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-049-09102", "result_code": "LK-EGFR21" },
    "order_id": "NO-2026-60345"
  },
  "k": {
    "type": "imported_result",
    "test": { "nfm_code": "K", "name": "Potassium, serum", "loinc": "2823-3" },
    "value": "Result invalidated",
    "unit": "mmol/L",
    "reference_range": "3.5-5.1",
    "result_status": "C",
    "collected": "2026-02-18T07:21:00-06:00",
    "resulted": "2026-02-18T14:32:00-06:00",
    "comment": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 10:03. CORRECTED 02/18/26 14:32: result invalidated, see recollected specimen LV26-049-48984.",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-049-09102", "result_code": "LK-K" },
    "order_id": "NO-2026-52516"
  },
  "chol": {
    "type": "imported_result",
    "test": { "nfm_code": "CHOL", "name": "Cholesterol, total", "loinc": "2093-3" },
    "value": "177",
    "unit": "mg/dL",
    "reference_range": "100-199",
    "result_status": "F",
    "collected": "2026-02-18T07:21:00-06:00",
    "resulted": "2026-02-18T09:57:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-049-09102", "result_code": "LK-CHOL" },
    "order_id": "NO-2026-72552"
  },
  "trig": {
    "type": "imported_result",
    "test": { "nfm_code": "TRIG", "name": "Triglycerides", "loinc": "2571-8" },
    "value": "177",
    "unit": "mg/dL",
    "reference_range": "0-149",
    "flag": "H",
    "result_status": "F",
    "collected": "2026-02-18T07:21:00-06:00",
    "resulted": "2026-02-18T09:57:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-049-09102", "result_code": "LK-TRIG" },
    "order_id": "NO-2026-72552"
  },
  "hdl": {
    "type": "imported_result",
    "test": { "nfm_code": "HDL", "name": "HDL cholesterol", "loinc": "2085-9" },
    "value": "57",
    "unit": "mg/dL",
    "reference_range": ">39",
    "result_status": "F",
    "collected": "2026-02-18T07:21:00-06:00",
    "resulted": "2026-02-18T09:57:00-06:00",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-049-09102", "result_code": "LK-HDL" },
    "order_id": "NO-2026-72552"
  },
  "ldl": {
    "type": "imported_result",
    "test": { "nfm_code": "LDL-CALC", "name": "LDL cholesterol, calculated", "loinc": "13457-7" },
    "value": "85",
    "unit": "mg/dL",
    "reference_range": "0-99",
    "result_status": "F",
    "collected": "2026-02-18T07:21:00-06:00",
    "resulted": "2026-02-18T09:57:00-06:00",
    "comment": "Calculated (Friedewald).",
    "external_ref": { "lab": "Lakeview Labs", "accession": "LV26-049-09102", "result_code": "LK-LDLC" },
    "order_id": "NO-2026-72552"
  }
}
```
