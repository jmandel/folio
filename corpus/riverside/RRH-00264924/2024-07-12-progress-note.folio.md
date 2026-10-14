---
folio: "0.1"
id: "01J2KHWKZ0079AQPG8V50DMNE6"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00264924"
effective: "2024-07-12T12:37:00Z"
recorded: "2024-07-12T13:25:00Z"
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

**Interval events.** No overnight events. The patient feels better, with less thirst and no new complaints. Normal saline continues at 125 mL/h.

**Exam.** At 07:17: BP 119/71, HR 105, RR 19, temperature 98.3 F, SpO2 99%. Alert and comfortable. Mucous membranes moist. Lungs clear, abdomen soft.

**Results.** <ref id="bmp">BMP at 06:26: sodium 135, potassium 5.8, chloride 99, bicarbonate 25, anion gap 11, urea nitrogen 33, creatinine 1.53, eGFR 54, glucose 101.</ref> Compared with yesterday's creatinine of 2.02, kidney function is improving. Bicarbonate has normalized, and potassium has come down from 6.7 but is still high.

**Medications.** Lisinopril remains held. Amlodipine, atorvastatin and levothyroxine continue.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, improving on IV fluids. Continue normal saline and repeat the BMP tomorrow morning.
2. Potassium 5.8, still elevated but better. Recheck with the next panel.
3. Heart rate is on the fast side at 105 despite fluids; we will keep watching it as volume is restored.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6553794",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-07-11T21:34:00Z",
    "admitted": "2024-07-12T03:12:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-07-12T12:17:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 105,
    "resp_rate_per_min": 19,
    "temp_f": 98.3,
    "spo2_pct": 99,
    "weight_kg": 80.8
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
    "accession": "L24194-1397",
    "collected": "2024-07-12T11:26:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "135",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.8",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "33",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.53",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "54",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "101",
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
    "started": "2024-07-11T22:24:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
