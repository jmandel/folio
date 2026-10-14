---
folio: "0.1"
id: "01JEMX0J90V7DY9R2K141N50YR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00453627"
effective: "2024-12-09T02:41:00Z"
recorded: "2024-12-09T05:07:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** acute kidney injury with high potassium after several days of diarrhea.

**History.** The patient was seen in the ED today after four days of watery diarrhea with poor intake and lightheadedness on standing. Throughout this time they kept taking their usual blood pressure medicines. Home medications include carvedilol 12.5 mg twice daily and atorvastatin 40 mg nightly, in addition to those addressed below. Allergies: NKDA.

**Exam.** Vitals at 20:31: BP 124/74, HR 100, RR 24, T 98.7 F, SpO2 96%. Mildly tachycardic, breathing a little fast but comfortable on room air.

**Results.** The 14:20 panel showed sodium 130, potassium 6.4, chloride 104, bicarbonate 16, anion gap 10, urea nitrogen 48, creatinine 1.67, eGFR 43 and glucose 210. Normal saline 1000 mL bolus was started at 14:45, followed by 125 mL/h, and is still running.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> Continue IV saline and recheck a basic metabolic panel in the morning.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.4 on arrival, in the setting of the kidney injury and potassium-sparing therapy. Recheck with the morning panel.
3. Medications: <ref id="med_hydrochlorothiazide">hold hydrochlorothiazide</ref> and <ref id="med_furosemide">hold furosemide</ref> for volume depletion. <ref id="med_losartan">Hold losartan</ref> and <ref id="med_spironolactone">hold spironolactone</ref> until creatinine is back to baseline. <ref id="med_metformin">Hold metformin</ref> during the acute illness.
4. Continue carvedilol and atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6217776",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-12-08T19:55:00Z",
    "admitted": "2024-12-09T01:30:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-12-09T02:31:00Z",
    "bp": { "systolic_mmhg": 124, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 100,
    "resp_rate_per_min": 24,
    "temp_f": 98.7,
    "spo2_pct": 96,
    "weight_kg": 92.9
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
    "accession": "L24343-9471",
    "collected": "2024-12-08T20:20:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "130",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.4",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "16",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "48",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.67",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "43",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "210",
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
    "started": "2024-12-08T20:45:00Z"
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
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold during acute illness"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
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
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold until creatinine back to baseline"
  },
  "med_furosemide": {
    "type": "home_med",
    "drug_name": "furosemide 40 mg tablet",
    "rxnorm_ingredient": "4603",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "Hold for volume depletion"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
