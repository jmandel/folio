---
folio: "0.1"
id: "01JHY8EA10C34KS8M393J06M3A"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00152245"
effective: "2025-01-16T01:55:00Z"
effective_end: "2025-01-18T21:45:00Z"
recorded: "2025-01-19T03:07:00Z"
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

**Diagnoses:** <ref id="dx_aki">acute kidney injury</ref>, resolved; hyperkalemia, resolved.

**Hospital course.** The patient has type 2 diabetes and hypertension and was admitted with creatinine 2.46 and potassium 6.2. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> She received calcium gluconate in the ED and then intravenous saline. Her diarrhea stopped, she resumed eating and drinking, and her creatinine and potassium came down steadily.

**Condition at discharge.** BP 137/82, HR 87, RR 23, T 98.1 F, SpO2 99% at 12:45. She feels well. The discharge panel (06:24) showed sodium 138, potassium 4.9, chloride 105, bicarbonate 21, anion gap 12, urea nitrogen 27, creatinine 1.10 and glucose 153.

**Allergies:** lisinopril (cough); dapagliflozin (diabetic ketoacidosis).

**Discharge medications**

- <ref id="med_losartan">Losartan 50 mg daily: remains held; her PCP will decide on restarting after a repeat BMP.</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue.</ref>

**Follow-up.** She will see her primary care physician at Northgate Family Medicine within 1 week for a repeat BMP and to decide on restarting her held blood pressure medicines. She was asked to return for recurrent diarrhea, vomiting or very little urine.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6565340",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-01-15T21:34:00Z",
    "admitted": "2025-01-16T01:55:00Z",
    "discharged": "2025-01-18T21:45:00Z",
    "disposition": "home"
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "resolved",
    "rank": "principal"
  },
  "dx_hyperk": {
    "type": "diagnosis",
    "label": "Hyperkalemia",
    "icd10cm": "E87.5",
    "status": "resolved",
    "rank": "secondary"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-01-18T18:45:00Z",
    "bp": { "systolic_mmhg": 137, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 87,
    "resp_rate_per_min": 23,
    "temp_f": 98.1,
    "spo2_pct": 99,
    "weight_kg": 98.4
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25018-6487",
    "collected": "2025-01-18T12:24:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "27",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.10",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
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
        "value": "153",
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
  "alg_dapagliflozin": {
    "type": "allergy",
    "substance": "dapagliflozin",
    "rxnorm_ingredient": "1488564",
    "reaction": "diabetic ketoacidosis",
    "severity": "severe"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide on restarting after a repeat BMP"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
