---
folio: "0.1"
id: "01H1KXVA80ZYMDZA63ES4DCKYS"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00313418"
effective: "2023-05-29T12:59:00Z"
recorded: "2023-05-29T14:16:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval.** Saline was stopped at 04:47 this morning after about two days of infusion. The patient feels better, with less diarrhea and improved energy. No known drug allergies. Lisinopril and chlorthalidone remain held.

**Exam.** Vitals at 07:39: BP 132/79, HR 98, RR 20, T 98.1 F, SpO2 94%. Comfortable, mucous membranes moist, lungs clear.

**Results.** The <ref id="bmp">06:05 panel shows sodium 137, potassium 6.2 (critical), chloride 99, bicarbonate 22, anion gap 16, urea nitrogen 28, creatinine 1.63, eGFR 33 and glucose 122</ref>. Sodium has corrected, and urea nitrogen and creatinine are improving.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, improving with volume repletion; creatinine down from 1.89 on admission to 1.63. Continue to hold the home lisinopril and chlorthalidone. Repeat BMP tomorrow morning.
2. Potassium remains high at 6.2 despite the improvement in kidney function; this will be rechecked on the next panel.
3. Hyponatremia has resolved, sodium 137.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6774262",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-05-28T03:41:00Z",
    "admitted": "2023-05-28T09:47:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-05-29T12:39:00Z",
    "bp": { "systolic_mmhg": 132, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 98,
    "resp_rate_per_min": 20,
    "temp_f": 98.1,
    "spo2_pct": 94,
    "weight_kg": 95.7
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
    "accession": "L23149-9303",
    "collected": "2023-05-29T11:05:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.2",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "16", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "28",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.63",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "33",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "122",
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
    "started": "2023-05-28T04:31:00Z",
    "stopped": "2023-05-29T09:47:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "held"
  }
}
```
