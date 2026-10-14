---
folio: "0.1"
id: "01GWP6FT5053J7D0DMQGJ1N0DK"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00694329"
effective: "2023-03-29T06:21:00Z"
recorded: "2023-03-29T08:07:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** euglycemic diabetic ketoacidosis.

**History of present illness.** The patient came to the ED last night with several days of fever, body aches, cough and almost no oral intake, and then nausea and fast breathing. <ref id="precipitant">The ketoacidosis was precipitated by influenza with fever and poor oral intake.</ref> At home the patient takes <ref id="med_empagliflozin">empagliflozin 10 mg daily</ref>, metformin 1000 mg twice daily with meals, glipizide 5 mg daily, lisinopril 40 mg daily and atorvastatin 20 mg nightly. Allergies: NKDA.

**Exam.** Vitals at 01:11: BP 119/71, HR 99, RR 24, T 98.5 F, SpO2 95%. The patient is tired, with dry mucous membranes and deep respirations. The abdomen is soft.

**Results.** On the 21:25 panel: sodium 130, potassium 4.6, chloride 96, bicarbonate 11, anion gap 23, urea nitrogen 35, creatinine 2.17 (eGFR 37), glucose 206. Lipase 46 from the same draw.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. Insulin infusion per DKA protocol, started 22:15, continues, together with D5 lactated Ringer's at 150 mL/h since 22:15, since glucose is near normal. Chemistries will be repeated serially. The SGLT2 inhibitor is held.
2. <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 46, and the abdomen is soft.
3. Diabetes: <ref id="med_metformin">metformin is held while acidotic and NPO</ref>, to be resumed when able. Glipizide continues as listed.
4. Hypertension: <ref id="med_lisinopril">lisinopril 40 mg daily continues</ref>.
5. Hyperlipidemia: atorvastatin 20 mg nightly continues.
6. Creatinine 2.17 with eGFR 37; this will be followed on the repeat panels.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6552462",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-03-29T02:05:00Z",
    "admitted": "2023-03-29T05:21:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-03-29T06:11:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 24,
    "temp_f": 98.5,
    "spo2_pct": 95,
    "weight_kg": 69.6
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "dx_pancreatitis": {
    "type": "diagnosis",
    "label": "Acute pancreatitis",
    "icd10cm": "K85.90",
    "status": "ruled_out",
    "rank": "secondary"
  },
  "lipase": {
    "type": "result",
    "test": { "local_code": "LIPASE", "loinc": "3040-3", "name": "Lipase" },
    "accession": "L23087-5773",
    "collected": "2023-03-29T02:25:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "46",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23087-0364",
    "collected": "2023-03-29T02:25:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "130",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.6", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "96",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "11",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "LL"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "35",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.17",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "37",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "206",
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
    "started": "2023-03-29T03:15:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2023-03-29T03:15:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while acidotic and NPO"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
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
