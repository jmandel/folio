---
folio: "0.1"
id: "01HMW20NQ00JR098E2X533X9R4"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00386801"
effective: "2024-01-21T05:44:00Z"
effective_end: "2024-01-23T16:00:00Z"
recorded: "2024-01-23T21:01:00Z"
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

**Diagnoses.** <ref id="dx_aki">Acute kidney injury, resolved.</ref> Hyperkalemia, resolved.

**Hospital course.** The patient came to the ED with weakness, low urine output and poor intake of fluids, and was found to have a creatinine of 1.89 and a potassium of 6.5. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake.</ref> Calcium gluconate was given in the ED and the patient was treated with normal saline, first as a bolus and then as a continuous infusion that was stopped on 1/21. Kidney function improved each day and the patient tolerated meals and fluids.

**Condition at discharge.** Vitals: BP 118/71, HR 103, RR 16, temperature 98.2 F, SpO2 98%. Discharge basic metabolic panel (1/23, 06:28): sodium 138, potassium 5.2 (H), chloride 99, bicarbonate 24, anion gap 15, urea nitrogen 30 (H), creatinine 0.81, eGFR 81, glucose 142 (H). The patient feels well and is ready to go home.

**Allergies:** empagliflozin (diabetic ketoacidosis).

**Discharge medications**

- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue.</ref>
- Atorvastatin 20 mg nightly: continue.
- The blood pressure medicines held in hospital stay on hold until the primary care visit.

**Follow-up.** See primary care at Northgate Family Medicine within 1 week to repeat a basic metabolic panel and decide on restarting the held blood pressure medicines. Return for reduced urine output, weakness, palpitations or vomiting.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6786538",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-01-21T01:20:00Z",
    "admitted": "2024-01-21T05:44:00Z",
    "discharged": "2024-01-23T16:00:00Z",
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
    "taken": "2024-01-23T13:00:00Z",
    "bp": { "systolic_mmhg": 118, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 103,
    "resp_rate_per_min": 16,
    "temp_f": 98.2,
    "spo2_pct": 98,
    "weight_kg": 78.5
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24023-5183",
    "collected": "2024-01-23T12:28:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.2",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "15", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.81",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "81",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "142",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "alg_empagliflozin": {
    "type": "allergy",
    "substance": "empagliflozin",
    "rxnorm_ingredient": "1545653",
    "reaction": "diabetic ketoacidosis",
    "severity": "severe"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 500 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "500 mg",
    "sig": "1 tab PO BID with meals",
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
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
