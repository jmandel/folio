---
folio: "0.1"
id: "01JXB0NNA0K3MCRE4SE5GA293D"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00399619"
effective: "2025-06-05T07:15:00Z"
effective_end: "2025-06-09T15:30:00Z"
recorded: "2025-06-09T18:54:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnoses.** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved</ref>. Pancreatitis was considered at presentation and <ref id="dx_pancreatitis">acute pancreatitis was ruled out</ref>: lipase 27.

**Hospital course.** The patient presented with a wide anion gap acidosis (bicarbonate 8, anion gap 26, pH 7.20, beta-hydroxybutyrate 5.2) and a glucose of only 216. <ref id="precipitant">The ketoacidosis was precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days.</ref> The patient was treated with an insulin infusion and dextrose-containing fluids from 22:05 on 6/4, transitioned to subcutaneous glargine 12 units daily on 6/6, and the gap closed. Endocrinology saw the patient and advised against any SGLT2 inhibitor in the future. Potassium and creatinine normalized with fluids.

**Condition at discharge.** Vitals: BP 138/83, HR 98, RR 17, T 99.2 F, SpO2 98%. Eating well and feeling back to normal. Final panel on 6/9 at 06:24: sodium 135 (L), potassium 4.2, chloride 103, bicarbonate 23, anion gap 9, urea nitrogen 22, creatinine 1.08, eGFR 77, glucose 133 (H).

**Discharge medications**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: held. Do not resume until reviewed by the PCP.</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>
- <ref id="med_losartan">Losartan 100 mg daily: continue</ref>
- <ref id="med_hydrochlorothiazide">Hydrochlorothiazide 25 mg daily: continue</ref>
- Glipizide 5 mg daily: continue
- Semaglutide 0.5 mg subcutaneously weekly: continue
- Amlodipine 5 mg daily: continue
- Atorvastatin 20 mg nightly: continue

No known drug allergies.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to decide whether to restart empagliflozin and to recheck a basic metabolic panel. The patient should return for vomiting, inability to eat or drink, abdominal pain, or fast breathing.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6795419",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-06-05T01:55:00Z",
    "admitted": "2025-06-05T07:15:00Z",
    "discharged": "2025-06-09T15:30:00Z",
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
    "taken": "2025-06-09T12:30:00Z",
    "bp": { "systolic_mmhg": 138, "diastolic_mmhg": 83 },
    "heart_rate_bpm": 98,
    "resp_rate_per_min": 17,
    "temp_f": 99.2,
    "spo2_pct": 98,
    "weight_kg": 101.3
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25160-0645",
    "collected": "2025-06-09T11:24:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.2", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.08",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "77",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "133",
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
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
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
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
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
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 50 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "50 mg",
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
