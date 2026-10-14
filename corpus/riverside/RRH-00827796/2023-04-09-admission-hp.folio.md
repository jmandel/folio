---
folio: "0.1"
id: "01GXJWW7V0FYBZGPAXTP73C1W8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00827796"
effective: "2023-04-09T09:35:00Z"
recorded: "2023-04-09T11:37:00Z"
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

**Reason for admission:** hyperkalemia and acute kidney injury.

**History of present illness.** The patient came to the ED last night weak and dry after several days of poor fluid intake and back pain. <ref id="precipitant">Acute kidney injury attributed to several days of over-the-counter naproxen for back pain on top of an ARB and diuretic, with poor fluid intake</ref>. Labs in the ED showed potassium 6.8 and creatinine 2.89 (sodium 131, urea nitrogen 52, bicarbonate 22, eGFR 24). Normal saline was started at 23:45 as a 1000 mL bolus and continues at 125 mL/h.

**Allergies:** lisinopril (cough).

**Exam.** At 04:25: BP 108/65, HR 85, RR 21, temperature 98.1 F, SpO2 97%. Mucous membranes are dry. Heart regular, lungs clear, abdomen soft.

**Assessment and plan**

1. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.8 on the 23:17 panel. Repeat the basic metabolic panel in the morning and keep the patient on monitoring.
2. <ref id="dx_aki">Acute kidney injury</ref>, creatinine 2.89. Continue IV saline at 125 mL/h and recheck creatinine with the morning panel.
3. Hypertension: <ref id="med_losartan">hold losartan until creatinine is back to baseline</ref>.
4. Volume depletion: <ref id="med_hydrochlorothiazide">hold hydrochlorothiazide for volume depletion</ref>.
5. Diabetes: <ref id="med_metformin">hold metformin during the acute illness</ref>, and resume it when able.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6281782",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-04-09T03:55:00Z",
    "admitted": "2023-04-09T08:49:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-04-09T09:25:00Z",
    "bp": { "systolic_mmhg": 108, "diastolic_mmhg": 65 },
    "heart_rate_bpm": 85,
    "resp_rate_per_min": 21,
    "temp_f": 98.1,
    "spo2_pct": 97,
    "weight_kg": 82.4
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "dx_hyperk": {
    "type": "diagnosis",
    "label": "Hyperkalemia",
    "icd10cm": "E87.5",
    "status": "active",
    "rank": "secondary"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23098-5908",
    "collected": "2023-04-09T04:17:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.8",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "52",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.89",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "24",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "112",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "1000 mL bolus, then 125 mL/h",
    "started": "2023-04-09T04:45:00Z"
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
    "instructions": "Hold during acute illness"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold until creatinine back to baseline"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "Hold for volume depletion"
  }
}
```
