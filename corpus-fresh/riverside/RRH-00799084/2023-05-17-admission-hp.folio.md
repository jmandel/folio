---
folio: "0.1"
id: "01H0P671K08B8W6ETEWDR1S2RX"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00799084"
effective: "2023-05-17T23:11:00Z"
recorded: "2023-05-18T01:05:00Z"
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

**Reason for admission:** lower respiratory infection with poor intake and reduced kidney function.

**History of present illness.** The patient was seen in the ED this afternoon with several days of cough, tiredness and poor appetite, and is admitted for treatment and monitoring. Intake has been low, and the kidney function on arrival was worse than expected. The ED course is summarized in the ED provider note.

**Home medications.** Losartan 100 mg daily, metformin 1000 mg twice daily with meals, dapagliflozin 10 mg daily, hydrochlorothiazide 25 mg daily and amlodipine 5 mg daily.

**Allergies:** lisinopril (cough).

**Exam.** Vitals at 18:01: BP 113/68, HR 95, RR 21, temperature 98.4 F, SpO2 97%. Appears tired but comfortable at rest. Mucous membranes slightly dry. Breathing is mildly quickened, with crackles at the right base. Abdomen soft and nontender.

**Results.** The basic metabolic panel drawn at 14:30 showed sodium 132, potassium 4.2, chloride 101, bicarbonate 19, anion gap 12, urea nitrogen 56, creatinine 1.48, eGFR 45 and glucose 127. Normal saline at 75 mL/h has been running since 15:02.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Oxygen saturation is adequate on room air. Continue the IV fluids, and reassess in the morning with a repeat metabolic panel.
2. Kidney function is below what we would like, with creatinine 1.48. <ref id="med_losartan">Hold losartan until creatinine is back to baseline.</ref>
3. <ref id="med_metformin">Hold metformin during the acute illness.</ref> <ref id="med_dapagliflozin">Hold dapagliflozin while not eating.</ref> Both can be resumed when able.
4. Blood pressure is acceptable. Continue hydrochlorothiazide and amlodipine.
5. Lisinopril intolerance (cough) is noted; no ACE inhibitor will be used.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6143345",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-05-17T19:12:00Z",
    "admitted": "2023-05-17T22:25:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-05-17T23:01:00Z",
    "bp": { "systolic_mmhg": 113, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 95,
    "resp_rate_per_min": 21,
    "temp_f": 98.4,
    "spo2_pct": 97,
    "weight_kg": 74.4
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
    "accession": "L23137-1104",
    "collected": "2023-05-17T19:30:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.2", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "56",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.48",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "45",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "127",
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
    "started": "2023-05-17T20:02:00Z"
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
    "status": "continue"
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
