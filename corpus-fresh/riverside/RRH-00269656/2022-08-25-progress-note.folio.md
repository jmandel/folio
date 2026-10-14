---
folio: "0.1"
id: "01GBAM3410QDXMAFWD8DMMR7C6"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00269656"
effective: "2022-08-25T12:53:00Z"
recorded: "2022-08-25T13:47:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval.** She slept in short stretches and reports the cough is still productive but breathing feels a little easier. She is drinking and ate part of breakfast. No chest pain at rest.

**Exam.** Vitals at 07:33: BP 110/66, HR 102, RR 17, T 98.7 F, SpO2 95%. Lungs have persistent crackles at the right base without new findings. Heart is regular, mildly fast. Mucous membranes are moist.

**Results.** <ref id="bmp">The 06:15 panel shows sodium 139, potassium 3.9, chloride 99, bicarbonate 22, anion gap 18, urea nitrogen 28, creatinine 1.61, eGFR 46 and glucose 142</ref>. Creatinine is improving from yesterday's 1.70 with fluids. The anion gap is mildly raised at 18 with a normal bicarbonate.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, improving slowly. Continue ceftriaxone. Heart rate is still above 100, so we will keep watching it.
2. Kidney function: improving. Normal saline continues at 75 mL/h; repeat the panel in the morning.
3. Diabetes: metformin remains held, and glipizide continues. Glucose 142 this morning.
4. Atorvastatin continues. Lisinopril allergy (angioedema) is noted on the chart.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6036136",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-08-24T23:05:00Z",
    "admitted": "2022-08-25T02:45:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-08-25T12:33:00Z",
    "bp": { "systolic_mmhg": 110, "diastolic_mmhg": 66 },
    "heart_rate_bpm": 102,
    "resp_rate_per_min": 17,
    "temp_f": 98.7,
    "spo2_pct": 95,
    "weight_kg": 101
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L22237-9896",
    "collected": "2022-08-25T11:15:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "139", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "28",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.61",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "46",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "142",
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
    "dose_text": "75 mL/h",
    "started": "2022-08-24T23:55:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "angioedema",
    "severity": "severe"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
