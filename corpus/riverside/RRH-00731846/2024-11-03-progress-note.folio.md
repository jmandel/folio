---
folio: "0.1"
id: "01JBS6NAWG438V4FFMFA897Y1T"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00731846"
effective: "2024-11-03T13:40:00Z"
recorded: "2024-11-03T14:25:30Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Hospital day 3 progress note

**Interval.** Ms. Okafor feels much better this morning. She is no longer short of breath and is taking small amounts of food. Vitals at 07:20: BP 118/70, HR 92, RR 18, T 98.4 F, SpO2 98%.

**Exam.** Comfortable, breathing easily without the deep respirations noted on admission. Mucous membranes are moist. Abdomen soft and nontender.

**Results.** On the 06:10 panel: <ref id="bmp_am">sodium 131, potassium 4.2, chloride 99, bicarbonate 21, anion gap 11, urea nitrogen 19, creatinine 1.36, eGFR 45, glucose 148</ref>. The gap is closed and bicarbonate is nearly normal. <ref id="bhb_pm">Beta-hydroxybutyrate was 2.1 on the 12:05 draw yesterday.</ref>

**Assessment and plan**

1. <ref id="dx_edka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, improving. The <ref id="iv_insulin">insulin infusion per DKA protocol, running since 23:05 on 11/1</ref>, continues alongside D5 lactated Ringer's. <ref id="sc_glargine">Insulin glargine 14 units subcutaneously was started at 07:00 today</ref> as the basal dose. <ref id="med_empa">Empagliflozin remains held.</ref>
2. <ref id="med_metformin">Metformin remains held</ref> while she is still recovering from the acidosis.
3. Hyponatremia: sodium 131 and rising with fluids. Losartan and chlorthalidone remain held.
4. Atorvastatin continues.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6620417",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-02T02:40:00Z",
    "admitted": "2024-11-02T06:30:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-11-03T13:20:00Z",
    "bp": { "systolic_mmhg": 118, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 92,
    "resp_rate_per_min": 18,
    "temp_f": 98.4,
    "spo2_pct": 98
  },
  "dx_edka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "dx_na": {
    "type": "diagnosis",
    "label": "Hyponatremia",
    "icd10cm": "E87.1",
    "status": "active",
    "rank": "secondary"
  },
  "bhb_pm": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L24307-0233",
    "collected": "2024-11-02T17:05:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "2.1",
    "unit": "mmol/L",
    "ref_range": "<0.4",
    "flag": "H"
  },
  "bmp_am": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24308-0097",
    "collected": "2024-11-03T12:10:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "131",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.2", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "19", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.36",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "45",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "148",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2024-11-02T04:05:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2024-11-02T04:05:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "14 units daily",
    "started": "2024-11-03T13:00:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "cough",
    "severity": "mild"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held"
  },
  "med_empa": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
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
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 100 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
