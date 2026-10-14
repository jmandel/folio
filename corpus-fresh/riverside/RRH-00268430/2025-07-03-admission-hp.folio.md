---
folio: "0.1"
id: "01JZ9QEJQ06MZ10ZEEKNHRRJ3F"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00268430"
effective: "2025-07-04T01:38:00Z"
recorded: "2025-07-04T03:25:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**History.** The patient was seen in the ED this afternoon with several days of watery diarrhea and poor intake, and was found to have a markedly elevated potassium and a rise in creatinine. They continued their usual blood pressure and diuretic medicines throughout the illness. Allergy list: lisinopril (cough). Home medicines include semaglutide weekly, insulin glargine nightly and carvedilol, as well as the agents addressed below.

**Exam.** Vitals at 20:28: BP 132/79, HR 95, RR 21, T 98.8 F, SpO2 98%. Comfortable at rest, mucous membranes somewhat dry. Lungs clear, abdomen soft.

**Results.** The 14:15 panel showed sodium 132, potassium 6.5, bicarbonate 19, anion gap 11, urea nitrogen 54, creatinine 2.47 with eGFR 22, and glucose 112. A saline bolus of 1000 mL was started at 14:45 and continues at 125 mL/h.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>. <ref id="precipitant">The AKI is attributed to volume depletion from four days of diarrhea while continuing the ARB and diuretic.</ref> Continue IV saline and recheck the BMP in the morning.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.5 on arrival, treated in the ED. Repeat potassium with the morning labs.
3. <ref id="med_furosemide">Hold furosemide</ref> for volume depletion.
4. <ref id="med_losartan">Hold losartan</ref> until creatinine is back to baseline.
5. <ref id="med_spironolactone">Hold spironolactone</ref> until creatinine is back to baseline.
6. <ref id="med_metformin">Hold metformin</ref> during the acute illness.
7. <ref id="med_dapagliflozin">Hold dapagliflozin</ref> while not eating.
8. Diabetes: continue semaglutide and insulin glargine.
9. Continue carvedilol.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6487958",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-07-03T18:55:00Z",
    "admitted": "2025-07-04T00:56:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-07-04T01:28:00Z",
    "bp": { "systolic_mmhg": 132, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 95,
    "resp_rate_per_min": 21,
    "temp_f": 98.8,
    "spo2_pct": 98,
    "weight_kg": 77.9
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
    "accession": "L25184-5531",
    "collected": "2025-07-03T19:15:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "132",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.5",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "54",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.47",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "22",
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
    "started": "2025-07-03T19:45:00Z"
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
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while not eating"
  },
  "med_semaglutide": {
    "type": "home_med",
    "drug_name": "semaglutide pen",
    "rxnorm_ingredient": "1991302",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
    "status": "continue"
  },
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
    "status": "continue"
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
  }
}
```
