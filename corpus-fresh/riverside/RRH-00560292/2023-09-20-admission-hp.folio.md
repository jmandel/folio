---
folio: "0.1"
id: "01HARQ9PN0BR01Z8AQP0Z1RCP8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00560292"
effective: "2023-09-20T05:16:00Z"
recorded: "2023-09-20T07:19:00Z"
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

**Reason for admission:** pneumonia with abnormal kidney function.

**History of present illness.** The patient was seen in the ED this evening after several days of cough, tiredness and poor appetite, and was found to have pneumonia. Labs in the ED showed an elevated creatinine and a low bicarbonate. Intravenous saline was started at 18:24 and continues at 75 mL/h. No known drug allergies (NKDA).

**Home medications.** Insulin glargine 10 units nightly, lisinopril 40 mg daily, chlorthalidone 12.5 mg daily and amlodipine 5 mg daily, all to continue. Metformin and empagliflozin are addressed below.

**Exam.** Vitals at 00:06: BP 117/70, HR 91, RR 20, T 98.6 F, SpO2 98%. The patient is resting comfortably and conversant. Crackles are heard at the lung base without increased work of breathing. Heart regular. Abdomen soft, nontender.

**Results.** BMP drawn at 17:55: sodium 136, potassium 4.8, chloride 98, bicarbonate 20 (L), anion gap 18 (H), urea nitrogen 55 (H), creatinine 2.48 (H), eGFR 23 (L), glucose 164 (H).

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>: continue antibiotic treatment started in the ED and monitor breathing and oxygen saturation overnight.
2. Kidney function: creatinine 2.48 with an elevated anion gap. Continue normal saline at 75 mL/h and repeat the BMP in the morning.
3. Diabetes: <ref id="med_metformin">hold metformin 500 mg twice daily during the acute illness</ref>, to be resumed when able. <ref id="med_empagliflozin">Hold empagliflozin 10 mg daily while the patient is not eating</ref>, also to be resumed when able. Continue insulin glargine 10 units nightly.
4. Hypertension: BP is acceptable. Continue lisinopril, chlorthalidone and amlodipine at home doses.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6289463",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-09-19T22:34:00Z",
    "admitted": "2023-09-20T04:09:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-09-20T05:06:00Z",
    "bp": { "systolic_mmhg": 117, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 20,
    "temp_f": 98.6,
    "spo2_pct": 98,
    "weight_kg": 71.7
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
    "accession": "L23262-3457",
    "collected": "2023-09-19T22:55:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.8", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "98", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "55",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.48",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "23",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "164",
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
    "started": "2023-09-19T23:24:00Z"
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
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
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
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 100 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
