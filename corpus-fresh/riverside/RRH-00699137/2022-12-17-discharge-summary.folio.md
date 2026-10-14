---
folio: "0.1"
id: "01GMH4DFV0K064ZHQYBCSE4K32"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00699137"
effective: "2022-12-15T10:00:00Z"
effective_end: "2022-12-17T19:45:00Z"
recorded: "2022-12-17T22:49:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis:** <ref id="dx_dka">Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated</ref>, resolved.

**Hospital course.** The patient was admitted from the emergency department with a wide anion gap metabolic acidosis and a glucose of only 157. <ref id="precipitant">The ketoacidosis was precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days.</ref> The patient was treated with an insulin infusion per DKA protocol and dextrose-containing fluids, with serial chemistries. The anion gap closed by 12/16, the infusion was stopped, and the patient was moved to subcutaneous insulin and then resumed a regular diet. Creatinine improved from 1.61 on admission to 1.38 at discharge.

**Condition at discharge.** Feeling well and eating without nausea. Vitals on the day of discharge: BP 136/82, HR 94, RR 22, T 98.8 F, SpO2 95%. No known drug allergies.

**Discharge labs.** Panel at 06:16 on 12/17: sodium 132 (L), potassium 4.4, chloride 98, bicarbonate 19 (L), anion gap 15, urea nitrogen 24 (H), creatinine 1.38 (H), eGFR 41 (L) and glucose 164 (H). Sodium remains mildly low and bicarbonate is slightly below normal, with a normal anion gap, so a recheck is planned.

**Medications**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: held. Do not resume until reviewed by PCP.</ref>
- All other home medications are to be continued at their usual doses, as before admission.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to decide whether to restart empagliflozin and to recheck a basic metabolic panel. Return to the ED for vomiting, abdominal pain, fast or deep breathing, or marked weakness, and sick-day precautions were reviewed with the patient.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6798353",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-12-15T05:48:00Z",
    "admitted": "2022-12-15T10:00:00Z",
    "discharged": "2022-12-17T19:45:00Z",
    "disposition": "home"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-12-17T16:45:00Z",
    "bp": { "systolic_mmhg": 136, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 94,
    "resp_rate_per_min": 22,
    "temp_f": 98.8,
    "spo2_pct": 95,
    "weight_kg": 74.7
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L22351-8842",
    "collected": "2022-12-17T12:16:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "132",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "98", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "15", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "24",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.38",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "41",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "164",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 500 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "500 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_carvedilol": {
    "type": "home_med",
    "drug_name": "carvedilol 12.5 mg tablet",
    "rxnorm_ingredient": "20352",
    "dose_text": "12.5 mg",
    "sig": "1 tab PO BID",
    "status": "continue"
  },
  "med_spironolactone": {
    "type": "home_med",
    "drug_name": "spironolactone 25 mg tablet",
    "rxnorm_ingredient": "9997",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_furosemide": {
    "type": "home_med",
    "drug_name": "furosemide 40 mg tablet",
    "rxnorm_ingredient": "4603",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart empagliflozin; recheck basic metabolic panel"
  }
}
```
