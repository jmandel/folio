---
folio: "0.1"
id: "01J02D5H00Y9N0D8P2EKT7RA8K"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00696404"
effective: "2024-06-07T23:28:00Z"
effective_end: "2024-06-10T20:15:00Z"
recorded: "2024-06-11T01:04:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**Hospital course.** The patient presented with weakness after days of diarrhea and was found to have a creatinine of 2.08, potassium 6.3 and a mild anion gap acidosis. <ref id="precipitant">The AKI was attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> The potassium was treated in the ED and the patient was given normal saline, a 1000 mL bolus and then 125 mL/h, which ran until the evening of 6/8. Renal function and potassium improved steadily with fluids, and the acidosis cleared.

**Diagnoses at discharge**

1. <ref id="dx_aki">Acute kidney injury, resolved</ref>
2. Hyperkalemia, resolved

**Condition at discharge.** Vitals at 12:15: BP 130/78, HR 86, RR 17, T 98.6 F, SpO2 97%. The patient is eating and drinking and feels well.

**Discharge labs.** The panel drawn on 6/10 at 06:10 showed sodium 137, potassium 5.0, chloride 101, bicarbonate 25, anion gap 11, urea nitrogen 19, creatinine 1.05 (H), eGFR 68 and glucose 115 (H). Creatinine has come down from 2.08 on admission.

**Allergies:** no known drug allergies.

**Medications**

- Atorvastatin 40 mg tablet, 40 mg by mouth nightly: continue.
- The blood pressure medicines that were held in the hospital remain held until follow-up.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week. Repeat BMP, and decide on restarting the held blood pressure medicines. The patient should return sooner for recurrent diarrhea, vomiting or markedly reduced urine.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6388766",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-06-07T20:20:00Z",
    "admitted": "2024-06-07T23:28:00Z",
    "discharged": "2024-06-10T20:15:00Z",
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
    "taken": "2024-06-10T17:15:00Z",
    "bp": { "systolic_mmhg": 130, "diastolic_mmhg": 78 },
    "heart_rate_bpm": 86,
    "resp_rate_per_min": 17,
    "temp_f": 98.6,
    "spo2_pct": 97,
    "weight_kg": 86.2
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24162-4657",
    "collected": "2024-06-10T11:10:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "19", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.05",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "68",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "115",
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
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
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
