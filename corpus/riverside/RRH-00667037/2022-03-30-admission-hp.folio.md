---
folio: "0.1"
id: "01FZESHT10XWD13YS353DJYM2E"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00667037"
effective: "2022-03-30T23:45:00Z"
recorded: "2022-03-31T01:31:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** <ref id="dx_pneumonia">Community-acquired pneumonia</ref>.

**History of present illness.** The patient was seen in the ED this afternoon and is admitted to the hospital service for treatment of pneumonia and for monitoring of kidney function. The ED work-up showed a raised creatinine, and intravenous saline was begun at 14:55 and is still running at 75 mL/h. The patient takes losartan, chlorthalidone and amlodipine at home for blood pressure.

**Allergies:** No known drug allergies.

**Home medications.** Losartan 100 mg daily, chlorthalidone 12.5 mg (one half of a 25 mg tablet) daily, and amlodipine 5 mg daily.

**Exam.** Vitals at 18:35: BP 131/79, HR 86, RR 20, temperature 98 F, SpO2 99%. The patient is comfortable and conversing in full sentences.

**Results.** The basic metabolic panel drawn at 14:31 showed sodium 137, potassium 4.5, chloride 98, bicarbonate 21 (low), anion gap 18 (high), urea nitrogen 46 (high), creatinine 2.14 (high), eGFR 34 (low) and glucose 127 (high).

**Assessment and plan**

1. Pneumonia as above. Continue the current inpatient treatment and monitor vital signs and oxygen saturation.
2. Elevated creatinine with a raised anion gap and low bicarbonate. Continue the saline at 75 mL/h and repeat the basic metabolic panel in the morning to follow creatinine and bicarbonate.
3. Hypertension: BP is 131/79 this evening. Continue losartan, chlorthalidone and amlodipine at the home doses.
4. No known drug allergies.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6361832",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-03-30T19:05:00Z",
    "admitted": "2022-03-30T22:57:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-03-30T23:35:00Z",
    "bp": { "systolic_mmhg": 131, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 86,
    "resp_rate_per_min": 20,
    "temp_f": 98,
    "spo2_pct": 99,
    "weight_kg": 102
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
    "accession": "L22089-9351",
    "collected": "2022-03-30T19:31:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.5", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "98", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
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
        "value": "46",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.14",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "34",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "127",
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
    "started": "2022-03-30T19:55:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
