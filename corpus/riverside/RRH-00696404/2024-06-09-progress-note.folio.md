---
folio: "0.1"
id: "01HZYMQ550Y6Y02KS12B3XV79Q"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00696404"
effective: "2024-06-09T12:34:00Z"
recorded: "2024-06-09T13:59:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval history.** The patient feels well, is eating and drinking, and has no further diarrhea to report. Normal saline was stopped yesterday at 18:28. No known drug allergies.

**Exam.** Vitals at 07:14: BP 111/67, HR 107, RR 19, T 98.7 F, SpO2 99%. Heart rate is still somewhat fast, though the patient is comfortable and not short of breath. Lungs clear.

**Results.** <ref id="bmp">The 06:10 panel showed sodium 137, potassium 5.2 (H), chloride 104, bicarbonate 24, anion gap 9, urea nitrogen 26 (H), creatinine 1.39 (H), eGFR 49 (L) and glucose 118 (H).</ref> Creatinine has come down again from 1.73 yesterday.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, continuing to recover off IV fluids. Encourage oral intake and repeat the BMP in the morning.
2. Hyperkalemia, nearly resolved: potassium 5.2, down from 5.9 yesterday. Recheck with the morning labs.
3. Hyperlipidemia: continue atorvastatin 40 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6388766",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-06-07T20:20:00Z",
    "admitted": "2024-06-07T23:28:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-06-09T12:14:00Z",
    "bp": { "systolic_mmhg": 111, "diastolic_mmhg": 67 },
    "heart_rate_bpm": 107,
    "resp_rate_per_min": 19,
    "temp_f": 98.7,
    "spo2_pct": 99,
    "weight_kg": 86.2
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24161-0048",
    "collected": "2024-06-09T11:10:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.2",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "26",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.39",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "49",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "118",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "1000 mL bolus, then 125 mL/h",
    "started": "2024-06-07T21:10:00Z",
    "stopped": "2024-06-08T23:28:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
