---
folio: "0.1"
id: "01HRN8MWF00WPEW5VNCY9BBS04"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00151233"
effective: "2024-03-08T08:43:00Z"
effective_end: "2024-03-10T18:15:00Z"
recorded: "2024-03-10T22:45:00Z"
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

**Hospital course.** The patient was admitted with weakness after four days of diarrhea and was found to have a markedly elevated potassium and a rise in creatinine. They were treated with intravenous calcium gluconate and normal saline. <ref id="dx_aki">The acute kidney injury resolved</ref> with fluids. <ref id="precipitant">The AKI was attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> Diarrhea settled and the patient is eating and drinking normally.

**Condition at discharge.** Vitals on the day of discharge, 10:15: BP 121/73, HR 102, RR 16, T 98.4 F, SpO2 97%. The patient feels well and is walking without difficulty. There are no known drug allergies.

**Discharge labs.** On the 06:26 panel on 3/10: sodium 138, potassium 5.4 (H), chloride 101, bicarbonate 26, anion gap 11, urea nitrogen 16, creatinine 1.13, eGFR 74, glucose 122 (H). Potassium is much improved from admission but remains slightly high, which is part of the reason for early repeat labs.

**Discharge medications**

- Amlodipine 5 mg by mouth daily: continue.
- Atorvastatin 40 mg by mouth nightly: continue.
- <ref id="med_lisinopril">Lisinopril 10 mg daily: held. The primary care physician will decide on restarting it after a repeat BMP.</ref>

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision on restarting the held blood pressure medicines. The patient was advised to keep drinking fluids and to return for weakness, palpitations, or recurrent diarrhea.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6752574",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-03-08T04:55:00Z",
    "admitted": "2024-03-08T08:43:00Z",
    "discharged": "2024-03-10T18:15:00Z",
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
    "taken": "2024-03-10T15:15:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 102,
    "resp_rate_per_min": 16,
    "temp_f": 98.4,
    "spo2_pct": 97,
    "weight_kg": 80.9
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24070-6396",
    "collected": "2024-03-10T11:26:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.4",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "16", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.13",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "74",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "122",
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide on restarting after a repeat BMP"
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
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
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
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
