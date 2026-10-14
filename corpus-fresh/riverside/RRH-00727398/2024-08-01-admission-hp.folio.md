---
folio: "0.1"
id: "01J46HW4A03PXEJ164QPAM09AK"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00727398"
effective: "2024-08-01T07:11:00Z"
recorded: "2024-08-01T08:46:00Z"
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

**History of present illness.** The patient was seen in the ED earlier this evening with cough, fatigue and shortness of breath, and was found to have pneumonia. Intravenous saline has been running at 75 mL/h since 20:45 because the kidney function was worse than expected. The patient is being admitted for continued treatment and monitoring. Breathing is a little fast but the patient is comfortable lying flat and talking.

**Home medications**

- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: hold during acute illness</ref>
- <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily: hold while not eating</ref>
- Losartan 100 mg daily: continue
- Chlorthalidone 12.5 mg (half of a 25 mg tablet) daily: continue
- Amlodipine 5 mg daily: continue
- Atorvastatin 40 mg nightly: continue

Both held drugs can be resumed when able.

**Allergies:** lisinopril (cough).

**Exam.** At 02:01: BP 113/68, HR 93, RR 24, T 98.7 F, SpO2 97%. Mildly increased work of breathing, with crackles at the base. Heart sounds regular. Abdomen soft. Mucous membranes slightly dry.

**Results.** Basic metabolic panel from 7/31 at 20:17: sodium 138, potassium 4.6, chloride 102, bicarbonate 22, anion gap 14, urea nitrogen 39 (H), creatinine 1.57 (H), eGFR 41 (L), glucose 193 (H).

**Assessment and plan**

1. Community-acquired pneumonia: continue treatment as started in the ED and monitor oxygen saturation and respiratory rate.
2. Kidney function: urea nitrogen and creatinine are elevated; continue the saline infusion and repeat the panel in the morning.
3. Diabetes medications are held as above while the patient is acutely ill.
4. Blood pressure medications and atorvastatin are continued as listed.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6163632",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-08-01T00:55:00Z",
    "admitted": "2024-08-01T05:52:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-08-01T07:01:00Z",
    "bp": { "systolic_mmhg": 113, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 93,
    "resp_rate_per_min": 24,
    "temp_f": 98.7,
    "spo2_pct": 97,
    "weight_kg": 77.5
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
    "accession": "L24213-8254",
    "collected": "2024-08-01T01:17:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.6", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "39",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.57",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "41",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "193",
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
    "started": "2024-08-01T01:45:00Z"
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
  }
}
```
