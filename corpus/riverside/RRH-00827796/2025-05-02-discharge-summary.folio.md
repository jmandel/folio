---
folio: "0.1"
id: "01JT9JSAF09D85G1EBYZXM9H7T"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00827796"
effective: "2025-04-28T22:43:00Z"
effective_end: "2025-05-02T17:45:00Z"
recorded: "2025-05-02T22:45:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnoses.** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved.</ref> <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 41.

**Hospital course.** The patient was admitted with ketoacidosis, bicarbonate 11 and an anion gap of 27 despite a glucose of 192. <ref id="precipitant">The ketoacidosis was precipitated by prolonged fasting for religious observance while continuing the SGLT2 inhibitor.</ref> Treatment was an insulin infusion with dextrose-containing fluids, then subcutaneous insulin glargine. The gap closed and the patient recovered and returned to eating.

**Condition at discharge.** Vitals at 09:45: BP 129/77, HR 81, RR 20, T 98.1 F, SpO2 98%.

**Discharge labs (5/2, 06:15).** Sodium 137, potassium 4.0, chloride 103, bicarbonate 22, anion gap 12, urea nitrogen 18, creatinine 1.76 (H), eGFR 43 (L), glucose 164 (H).

**Allergies:** lisinopril (cough).

**Discharge medications**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: held; do not resume until reviewed by the PCP.</ref>
- <ref id="med_metformin">Metformin 1000 mg by mouth twice daily with meals: continue.</ref>
- <ref id="med_hydrochlorothiazide">Hydrochlorothiazide 25 mg daily: continue.</ref>
- Losartan 50 mg daily: continue.
- Semaglutide 0.5 mg subcutaneously weekly: continue.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week, to decide whether to restart empagliflozin and to recheck a basic metabolic panel.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6322209",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-04-28T19:12:00Z",
    "admitted": "2025-04-28T22:43:00Z",
    "discharged": "2025-05-02T17:45:00Z",
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
  "dx_pancreatitis": {
    "type": "diagnosis",
    "label": "Acute pancreatitis",
    "icd10cm": "K85.90",
    "status": "ruled_out",
    "rank": "secondary"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-05-02T14:45:00Z",
    "bp": { "systolic_mmhg": 129, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 81,
    "resp_rate_per_min": 20,
    "temp_f": 98.1,
    "spo2_pct": 98,
    "weight_kg": 82.4
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25122-7262",
    "collected": "2025-05-02T11:15:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.76",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "43",
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
  "med_semaglutide": {
    "type": "home_med",
    "drug_name": "semaglutide pen",
    "rxnorm_ingredient": "1991302",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
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
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
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
