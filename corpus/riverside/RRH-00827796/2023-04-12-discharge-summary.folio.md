---
folio: "0.1"
id: "01GXW376300BRTXVX5G83W4Z0A"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00827796"
effective: "2023-04-09T08:49:00Z"
effective_end: "2023-04-12T20:45:00Z"
recorded: "2023-04-13T01:21:00Z"
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

**Diagnoses.** <ref id="dx_aki">Acute kidney injury, resolved.</ref> Hyperkalemia, resolved.

**Hospital course.** The patient was admitted with weakness after four days of diarrhea and was found to have creatinine 2.89 and potassium 6.8. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> Calcium gluconate was given in the ED, and normal saline was run from 4/8 until 4/10. Creatinine improved steadily and diarrhea settled.

**Condition at discharge.** Vitals at 12:45: BP 123/74, HR 103, RR 16, T 99.1 F, SpO2 95%. The patient is eating and drinking.

**Discharge labs (4/12, 06:21).** Sodium 133 (L), potassium 5.6 (H), chloride 100, bicarbonate 22, anion gap 11, urea nitrogen 29 (H), creatinine 1.63 (H), eGFR 47 (L), glucose 107 (H).

**Allergies:** lisinopril (cough).

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg by mouth twice daily with meals: continue.</ref>
- Semaglutide 0.5 mg subcutaneously weekly: continue.
- <ref id="med_losartan">Losartan 50 mg daily: held; the PCP will decide on restarting after a repeat BMP.</ref>
- <ref id="med_hydrochlorothiazide">Hydrochlorothiazide 25 mg daily: held; the PCP will decide after a repeat BMP.</ref>

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision about restarting the held blood pressure medicines.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6590130",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-04-09T03:55:00Z",
    "admitted": "2023-04-09T08:49:00Z",
    "discharged": "2023-04-12T20:45:00Z",
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
    "taken": "2023-04-12T17:45:00Z",
    "bp": { "systolic_mmhg": 123, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 103,
    "resp_rate_per_min": 16,
    "temp_f": 99.1,
    "spo2_pct": 95,
    "weight_kg": 82.4
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23102-9037",
    "collected": "2023-04-12T11:21:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "133",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.6",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "29",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.63",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "47",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "107",
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
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide on restarting after a repeat BMP"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide after a repeat BMP"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
