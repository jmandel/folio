---
folio: "0.1"
id: "01JYQ2PGG05F73ATPM9BQW4F8F"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00388366"
effective: "2025-06-25T01:00:00Z"
effective_end: "2025-06-26T17:00:00Z"
recorded: "2025-06-26T21:36:00Z"
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

**Diagnosis:** <ref id="dx_dka">Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated, resolved.</ref>

**Hospital course.** The patient presented to the ED with nausea, weakness and rapid breathing, and was found to have a severe anion gap acidosis with a glucose of only 242. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. They were treated with an insulin infusion per DKA protocol and dextrose-containing fluids, and the acidosis and anion gap cleared. They were then transitioned to subcutaneous insulin and resumed eating without difficulty. Kidney function, which was mildly impaired on arrival, improved with fluids.

**Condition at discharge.** Feeling well and eating normally. Vitals at 09:00: BP 130/78, HR 89, RR 17, T 98.7 F, SpO2 96%. Allergies: NKDA.

**Discharge labs.** BMP drawn 6/26 at 06:28: sodium 135, potassium 4.0, chloride 99, bicarbonate 24, anion gap 12, urea nitrogen 18, creatinine 1.36, eGFR 60, glucose 165.

**Medications at discharge**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: do not resume until reviewed by the PCP.</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue.</ref>
- <ref id="med_lisinopril">Lisinopril 20 mg daily: continue.</ref>
- <ref id="med_hydrochlorothiazide">Hydrochlorothiazide 25 mg daily: continue.</ref>

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to decide whether to restart empagliflozin and to recheck a basic metabolic panel. The patient was advised to return for nausea, vomiting, abdominal pain or fast breathing.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6437094",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-06-24T20:55:00Z",
    "admitted": "2025-06-25T01:00:00Z",
    "discharged": "2025-06-26T17:00:00Z",
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
    "taken": "2025-06-26T14:00:00Z",
    "bp": { "systolic_mmhg": 130, "diastolic_mmhg": 78 },
    "heart_rate_bpm": 89,
    "resp_rate_per_min": 17,
    "temp_f": 98.7,
    "spo2_pct": 96,
    "weight_kg": 79.1
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25177-4459",
    "collected": "2025-06-26T11:28:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.36",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "60",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "165",
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
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart empagliflozin; recheck basic metabolic panel"
  }
}
```
