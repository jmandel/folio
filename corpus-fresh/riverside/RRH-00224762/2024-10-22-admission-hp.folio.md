---
folio: "0.1"
id: "01JAVWQKE04HF3W75HC3ZYC334"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00224762"
effective: "2024-10-23T02:46:00Z"
recorded: "2024-10-23T05:14:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** <ref id="dx_pneumonia">community-acquired pneumonia</ref>.

**History of present illness.** Mr. Dalton is a patient with type 2 diabetes, hypertension, hypothyroidism and chronic kidney disease who came to the ED this afternoon after several days of cough productive of yellow sputum, fever at home and increasing shortness of breath with walking. He was found to have a high white count and a chest film consistent with pneumonia, and the ED team started IV fluids and antibiotics. He has been eating less than usual over the past few days.

**Allergies:** lisinopril (angioedema).

**Home medications.** Insulin glargine 14 units nightly, losartan 100 mg daily, chlorthalidone 12.5 mg daily, atorvastatin 40 mg nightly and levothyroxine 75 mcg daily are continued. Amlodipine 10 mg daily is on his list and has not yet been reconciled.

**Exam.** Vitals at 21:36: BP 130/78, HR 109, RR 24, T 98.9 F, SpO2 99%. He is tired but conversant. He is breathing a little fast, with crackles at the right base. Heart is regular and tachycardic. Abdomen is soft. No leg edema.

**Results.** The 16:05 panel showed sodium 137, potassium 4.3, bicarbonate 18 (low), anion gap 15, urea nitrogen 31, creatinine 1.84 and eGFR 34, with glucose 178. Normal saline is running at 75 mL/h.

**Assessment and plan**

1. Community-acquired pneumonia: continue antibiotics and fluids, monitor oxygenation and respiratory rate overnight.
2. Diabetes: <ref id="med_metformin">hold metformin during the acute illness</ref>, and <ref id="med_empagliflozin">hold empagliflozin while he is not eating</ref>. Continue glargine as above, with glucose checks.
3. Kidney function is worse than expected with a low bicarbonate; we will give fluids and recheck the panel in the morning.
4. Hypertension: BP is acceptable on the current regimen.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6382106",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-10-22T20:34:00Z",
    "admitted": "2024-10-23T02:02:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-10-23T02:36:00Z",
    "bp": { "systolic_mmhg": 130, "diastolic_mmhg": 78 },
    "heart_rate_bpm": 109,
    "resp_rate_per_min": 24,
    "temp_f": 98.9,
    "spo2_pct": 99,
    "weight_kg": 69.9
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24296-1356",
    "collected": "2024-10-22T21:05:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "15", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "31",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.84",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "34",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "178",
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
    "dose_text": "75 mL/h",
    "started": "2024-10-22T21:24:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "angioedema",
    "severity": "severe"
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
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while not eating"
  },
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "14 units",
    "sig": "14 units SubQ nightly",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
