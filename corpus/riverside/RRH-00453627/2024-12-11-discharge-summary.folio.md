---
folio: "0.1"
id: "01JEW47VM0V33FZZXSQ3XZBCEJ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00453627"
effective: "2024-12-09T01:30:00Z"
effective_end: "2024-12-11T20:30:00Z"
recorded: "2024-12-12T00:28:00Z"
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

**Diagnoses.** <ref id="dx_aki">Acute kidney injury, resolved.</ref> Hyperkalemia, resolved.

**Hospital course.** The patient was admitted with diarrhea for four days, a creatinine of 1.67 and a potassium of 6.4. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> The potassium was treated in the ED and the patient received IV normal saline, with steady improvement. The home blood pressure and diabetes medicines that could contribute were held in hospital.

**Condition at discharge.** Vitals on the day of discharge at 11:30: BP 121/73, HR 85, RR 17, T 98.7 F, SpO2 94%. The patient is eating and drinking normally and the diarrhea has stopped. The final panel, drawn at 06:20 on 12/11, showed sodium 136, potassium 5.0, chloride 99, bicarbonate 25, anion gap 12, urea nitrogen 34, creatinine 0.96, eGFR 85 and glucose 144.

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue.</ref>
- Carvedilol 12.5 mg twice daily: continue.
- Atorvastatin 40 mg nightly: continue.
- <ref id="med_losartan">Losartan 100 mg daily: held; the PCP will decide on restarting after a repeat BMP.</ref>
- <ref id="med_hydrochlorothiazide">Hydrochlorothiazide 25 mg daily: held; the PCP will decide after a repeat BMP.</ref>
- <ref id="med_furosemide">Furosemide 40 mg daily: held; the PCP will decide after a repeat BMP.</ref>
- <ref id="med_spironolactone">Spironolactone 25 mg daily: stopped.</ref>

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision about restarting the held blood pressure medicines. The patient should return sooner for recurrent diarrhea, dizziness or weakness.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6217776",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-12-08T19:55:00Z",
    "admitted": "2024-12-09T01:30:00Z",
    "discharged": "2024-12-11T20:30:00Z",
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
    "taken": "2024-12-11T17:30:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 85,
    "resp_rate_per_min": 17,
    "temp_f": 98.7,
    "spo2_pct": 94,
    "weight_kg": 92.9
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24346-8116",
    "collected": "2024-12-11T12:20:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "34",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.96",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "85",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "144",
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
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
  "med_carvedilol": {
    "type": "home_med",
    "drug_name": "carvedilol 12.5 mg tablet",
    "rxnorm_ingredient": "20352",
    "dose_text": "12.5 mg",
    "sig": "1 tab PO BID",
    "status": "continue"
  },
  "med_spironolactone": {
    "type": "home_med",
    "drug_name": "spironolactone 25 mg tablet",
    "rxnorm_ingredient": "9997",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "stopped"
  },
  "med_furosemide": {
    "type": "home_med",
    "drug_name": "furosemide 40 mg tablet",
    "rxnorm_ingredient": "4603",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide after a repeat BMP"
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
