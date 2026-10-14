---
folio: "0.1"
id: "01H3D5DHK0FNB0XHMA2FVKAZKV"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00305402"
effective: "2023-06-19T04:11:00Z"
effective_end: "2023-06-20T15:45:00Z"
recorded: "2023-06-20T19:45:00Z"
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

**Diagnoses at discharge:** acute kidney injury, resolved; hyperkalemia, resolved.

**Hospital course.** The patient was admitted with a creatinine of 1.89 and a potassium of 6.3 after four days of diarrhea and poor intake. Potassium was treated in the ED with IV calcium, and saline was given as a bolus and then as a continuous infusion. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> The diarrhea settled, the patient resumed eating and drinking, and kidney function recovered steadily. The hyperkalemia resolved as the kidney injury improved.

**Condition at discharge.** Vitals at 07:45: BP 121/73, HR 87, RR 17, T 99.2 F, SpO2 98%. The patient feels well, is eating normally and is walking without light-headedness. No known drug allergies (NKDA).

**Discharge labs.** On the 06:17 panel on 6/20, sodium 137, potassium 4.8, chloride 102, bicarbonate 26, anion gap 9, urea nitrogen 21, creatinine 0.89 with eGFR 79, and glucose 152. The <ref id="dx_aki">acute kidney injury has resolved</ref>, with creatinine back to normal from a peak of 1.89.

**Discharge medications**

- Losartan 50 mg daily: <ref id="med_losartan">remains held; the PCP will decide on restarting after a repeat BMP.</ref>
- <ref id="med_metformin">Continue metformin 1000 mg twice daily with meals.</ref>
- Continue atorvastatin 40 mg nightly.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision on restarting the held blood pressure medicines. The patient should drink fluids freely and return sooner for recurrent diarrhea, vomiting, or markedly reduced urine output.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6441424",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-06-18T22:34:00Z",
    "admitted": "2023-06-19T04:11:00Z",
    "discharged": "2023-06-20T15:45:00Z",
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
    "taken": "2023-06-20T12:45:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 87,
    "resp_rate_per_min": 17,
    "temp_f": 99.2,
    "spo2_pct": 98,
    "weight_kg": 70.1
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23171-3153",
    "collected": "2023-06-20T11:17:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.8", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "21", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.89",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "79",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "152",
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
