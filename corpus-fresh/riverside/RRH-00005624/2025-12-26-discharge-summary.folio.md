---
folio: "0.1"
id: "01KDESB2J0VYJM1XW86K37CFQ0"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00005624"
effective: "2025-12-23T02:14:00Z"
effective_end: "2025-12-26T21:45:00Z"
recorded: "2025-12-27T02:14:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**Hospital course.** The patient was admitted with several days of diarrhea and poor intake and was found to have a creatinine of 5.44 and a potassium of 6.0. They were treated with IV calcium and isotonic saline, with steady improvement. Saline was stopped on the evening of 12/23 and kidney function continued to recover on oral intake. <ref id="precipitant">The AKI was attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> The hyperkalemia resolved.

**Condition at discharge.** Vitals at 12:45: BP 133/80, HR 80, RR 20, T 98.7 F, SpO2 95%. The patient is eating, the diarrhea has resolved, and they feel well. On the 06:24 panel on 12/26: sodium 136, potassium 4.7, chloride 102, bicarbonate 22, anion gap 12, urea nitrogen 32 (H), creatinine 2.35 (H), eGFR 33 (L), glucose 156 (H). <ref id="dx_aki">The acute kidney injury has resolved</ref> from its peak, though creatinine has not yet returned fully to baseline.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_losartan">Losartan 100 mg daily: held; the PCP will decide on restarting after a repeat BMP</ref>
- <ref id="med_chlorthalidone">Chlorthalidone 12.5 mg (half of a 25 mg tablet) daily: held; the PCP will decide after a repeat BMP</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue</ref>
- Dapagliflozin 10 mg daily: continue
- Amlodipine 5 mg daily: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision about restarting the held blood pressure medicines. The patient was advised to keep up oral fluids and to return for repeated vomiting or diarrhea, very little urine, or lightheadedness.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6114021",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-12-22T19:55:00Z",
    "admitted": "2025-12-23T02:14:00Z",
    "discharged": "2025-12-26T21:45:00Z",
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
    "taken": "2025-12-26T18:45:00Z",
    "bp": { "systolic_mmhg": 133, "diastolic_mmhg": 80 },
    "heart_rate_bpm": 80,
    "resp_rate_per_min": 20,
    "temp_f": 98.7,
    "spo2_pct": 95,
    "weight_kg": 100
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25360-9016",
    "collected": "2025-12-26T12:24:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.7", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "32",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.35",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "33",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "156",
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
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
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
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide after a repeat BMP"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
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
