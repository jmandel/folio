---
folio: "0.1"
id: "01J2FZ7630Z79RZF7A6VGR3P6K"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00706647"
effective: "2024-07-11T02:24:00Z"
recorded: "2024-07-11T04:01:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** <ref id="dx_dka">euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated</ref>.

**History of present illness.** The patient has type 2 diabetes and hypertension and presented to the ED today with malaise, nausea and rapid breathing. Labs in the ED showed a metabolic acidosis with a glucose of only 218. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. She has been admitted to the hospitalist service for insulin infusion and monitoring.

**Home medications.** Metformin 1000 mg twice daily with meals, glipizide 5 mg daily, losartan 50 mg daily, atorvastatin 20 mg nightly, and the SGLT2 inhibitor addressed in the plan below.

**Allergies:** lisinopril (cough).

**Exam.** At 21:14: BP 110/66, HR 90, RR 22, temperature 98.2 F, SpO2 96%. Deep, somewhat rapid respirations. Abdomen soft.

**Results.** On the 15:07 panel: sodium 130, potassium 4.7, chloride 97, bicarbonate 12, anion gap 21, urea nitrogen 35, creatinine 1.51 (eGFR 50), glucose 218. <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 39.

**Assessment and plan**

1. Euglycemic DKA with an elevated anion gap. The insulin infusion per DKA protocol at 0.1 units/kg/h, started 15:58, is still running together with D5 lactated Ringer's at 150 mL/h, since glucose is near normal. Recheck the basic metabolic panel serially until the gap closes. <ref id="med_empagliflozin">Hold empagliflozin 10 mg daily.</ref>
2. <ref id="med_metformin">Hold metformin while acidotic and NPO</ref>; resume when able.
3. Hypertension: BP is stable. <ref id="med_losartan">Continue losartan 50 mg daily.</ref>
4. Creatinine 1.51 on arrival; follow with fluids and repeat labs.
5. Continue glipizide and atorvastatin as listed.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6497025",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-07-10T19:48:00Z",
    "admitted": "2024-07-11T01:17:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-07-11T02:14:00Z",
    "bp": { "systolic_mmhg": 110, "diastolic_mmhg": 66 },
    "heart_rate_bpm": 90,
    "resp_rate_per_min": 22,
    "temp_f": 98.2,
    "spo2_pct": 96,
    "weight_kg": 105.8
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
    "accession": "L24192-0443",
    "collected": "2024-07-10T20:07:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "39",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24192-2887",
    "collected": "2024-07-10T20:07:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.7", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "97",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "12",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "21",
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
        "value": "1.51",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "50",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "218",
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
    "started": "2024-07-10T20:58:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2024-07-10T20:58:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
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
