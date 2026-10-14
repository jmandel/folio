---
folio: "0.1"
id: "01H851WTG0Q3AE6WF2NPV741VD"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00652687"
effective: "2023-08-16T01:48:00Z"
effective_end: "2023-08-18T15:45:00Z"
recorded: "2023-08-18T19:28:00Z"
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

**Diagnosis:** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved</ref>.

**Hospital course.** The patient was admitted on 8/15 with euglycemic diabetic ketoacidosis and treated with an insulin infusion per DKA protocol and dextrose-containing fluids. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. The acidosis cleared within the first day, and the patient was transitioned to subcutaneous basal insulin and resumed eating without nausea. Creatinine was 1.93 on admission and 1.96 on the day of discharge.

**Discharge exam and results.** On the morning of discharge: BP 137/82, HR 83, RR 20, T 98.1 F, SpO2 94%. Comfortable and eating. The 8/18 06:07 panel showed sodium 131, potassium 4.4, chloride 103, bicarbonate 20, anion gap 8, urea nitrogen 16, creatinine 1.96 (eGFR 29) and glucose 130.

**Allergies:** no known drug allergies.

**Medications at discharge**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: do not resume until reviewed by PCP</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue</ref>
- <ref id="med_losartan">Losartan 100 mg daily: continue</ref>

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to decide whether to restart empagliflozin and to recheck a basic metabolic panel. The patient should return for vomiting, abdominal pain, fast breathing or inability to eat.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6337771",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-08-15T19:41:00Z",
    "admitted": "2023-08-16T01:48:00Z",
    "discharged": "2023-08-18T15:45:00Z",
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
    "taken": "2023-08-18T12:45:00Z",
    "bp": { "systolic_mmhg": 137, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 83,
    "resp_rate_per_min": 20,
    "temp_f": 98.1,
    "spo2_pct": 94,
    "weight_kg": 83.2
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23230-5979",
    "collected": "2023-08-18T11:07:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "16", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.96",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "29",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "130",
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
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
