---
folio: "0.1"
id: "01K5DFYEF01Y4YQJJMPNWGFRAZ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00546055"
effective: "2025-09-18T01:49:00Z"
recorded: "2025-09-18T04:05:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient was seen in the ED today with several days of feeling run down and passing less urine, after taking over-the-counter naproxen for back pain. Labs drawn in the ED at 14:49 showed a creatinine of 3.28, a potassium of 6.3 and a bicarbonate of 17. Calcium gluconate was given in the ED, and a saline bolus was started at 15:24 and is still running at 125 mL/h.

**Home medications.** Metformin 1000 mg twice daily with meals, empagliflozin 10 mg daily, losartan 100 mg daily, chlorthalidone 12.5 mg daily (half of a 25 mg tablet) and amlodipine 5 mg daily.

**Allergies:** NKDA.

**Exam.** At 20:39: BP 106/64, HR 91, RR 22, T 98.9 F, SpO2 99%. Comfortable at rest, mucous membranes somewhat dry. Lungs clear, abdomen soft.

**Results.** Sodium 131, potassium 6.3, chloride 103, bicarbonate 17, anion gap 11, urea nitrogen 54, creatinine 3.28, eGFR 19, glucose 163.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake.</ref> Continue isotonic saline as above and follow the creatinine on the morning panel.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.3 on arrival, treated with calcium gluconate in the ED. Repeat potassium with the morning labs.
3. <ref id="med_losartan">Hold losartan</ref> until creatinine is back to baseline.
4. <ref id="med_chlorthalidone">Hold chlorthalidone</ref> for volume depletion.
5. <ref id="med_metformin">Hold metformin</ref> during the acute illness.
6. <ref id="med_empagliflozin">Hold empagliflozin</ref> while she is not eating.
7. Hypertension: BP is soft-normal. Amlodipine 5 mg daily continues.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6488440",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-09-17T19:34:00Z",
    "admitted": "2025-09-18T00:53:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-09-18T01:39:00Z",
    "bp": { "systolic_mmhg": 106, "diastolic_mmhg": 64 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 22,
    "temp_f": 98.9,
    "spo2_pct": 99,
    "weight_kg": 108.5
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
    "accession": "L25260-3539",
    "collected": "2025-09-17T19:49:00Z",
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
        "value": "6.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "17",
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
        "value": "3.28",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "19",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "163",
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
    "started": "2025-09-17T20:24:00Z"
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
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "Hold for volume depletion"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
