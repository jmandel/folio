---
folio: "0.1"
id: "01JGJADMD03V0BTMEQA76TFEE7"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00046468"
effective: "2024-12-31T01:17:00Z"
effective_end: "2025-01-01T21:30:00Z"
recorded: "2025-01-02T01:35:00Z"
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

**Diagnoses.** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved</ref>. <ref id="dx_pancreatitis">Acute pancreatitis was ruled out</ref> with a normal lipase of 35.

**Hospital course.** The patient was admitted with ketoacidosis and a glucose of 210. <ref id="precipitant">The ketoacidosis was precipitated by a weekend of heavy alcohol use with little food.</ref> The patient was treated with an insulin infusion and fluids, and the anion gap closed. On the final panel sodium was 136, potassium 4.2, chloride 104, bicarbonate 23, anion gap 9, urea nitrogen 25, creatinine 1.09 (eGFR 56) and glucose 129. At the last check, BP 135/81, HR 80, RR 16, T 98.6 F, SpO2 94%. The patient is eating and feels well.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: do not resume until reviewed by the PCP</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>
- <ref id="med_lisinopril">Lisinopril 40 mg daily: continue</ref>
- <ref id="med_chlorthalidone">Chlorthalidone 12.5 mg (half of a 25 mg tablet) daily: continue</ref>
- Amlodipine 5 mg daily: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to decide whether to restart empagliflozin and to recheck a basic metabolic panel. The patient was counseled to return for vomiting, abdominal pain, fast breathing or inability to eat or drink.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6956329",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-12-30T21:55:00Z",
    "admitted": "2024-12-31T01:17:00Z",
    "discharged": "2025-01-01T21:30:00Z",
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
    "taken": "2025-01-01T18:30:00Z",
    "bp": { "systolic_mmhg": 135, "diastolic_mmhg": 81 },
    "heart_rate_bpm": 80,
    "resp_rate_per_min": 16,
    "temp_f": 98.6,
    "spo2_pct": 94,
    "weight_kg": 103.1
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25001-0943",
    "collected": "2025-01-01T12:19:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.2", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "25",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.09",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "56",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "129",
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
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
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
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart empagliflozin; recheck basic metabolic panel"
  }
}
```
