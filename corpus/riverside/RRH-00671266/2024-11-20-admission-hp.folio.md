---
folio: "0.1"
id: "01JD6DQSH0VSN1HDDSTCERWNAR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00671266"
effective: "2024-11-21T01:37:00Z"
recorded: "2024-11-21T03:55:00Z"
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

**Reason for admission:** pneumonia.

**History of present illness.** The patient was seen in the ED this afternoon with a cough and feeling unwell, and is admitted for treatment and monitoring. Labs drawn at 14:36 showed a urea nitrogen of 58 and a creatinine of 1.64, and intravenous normal saline was started at 15:10 and is still running at 75 mL/h.

**Home medications.** Metformin 500 mg twice daily with meals, lisinopril 20 mg daily, amlodipine 5 mg daily and atorvastatin 40 mg nightly.

**Allergies:** no known drug allergies.

**Exam.** Vitals at 19:27: BP 126/76, HR 104, RR 20, T 99 F, SpO2 97%. The patient is comfortable and speaks in full sentences. Heart rate is mildly fast with a regular rhythm. Breathing is unlabored on room air.

**Results.** Basic metabolic panel at 14:36: sodium 137, potassium 4.3, chloride 106, bicarbonate 22, anion gap 9, urea nitrogen 58, creatinine 1.64, eGFR 44, glucose 146.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, active. Supportive care, and monitor temperature, heart rate and oxygen saturation overnight.
2. Diabetes medication: <ref id="med_metformin">hold metformin during the acute illness</ref>, to be resumed when able.
3. Kidney function: creatinine and urea nitrogen are elevated on admission. Continue the normal saline at 75 mL/h and repeat the basic metabolic panel in the morning.
4. Hypertension: continue lisinopril and amlodipine. Blood pressure is acceptable tonight.
5. Continue atorvastatin at night.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6589057",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-20T20:20:00Z",
    "admitted": "2024-11-21T00:41:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-11-21T01:27:00Z",
    "bp": { "systolic_mmhg": 126, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 104,
    "resp_rate_per_min": 20,
    "temp_f": 99,
    "spo2_pct": 97,
    "weight_kg": 84.6
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
    "accession": "L24325-8171",
    "collected": "2024-11-20T20:36:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "106", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "58",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.64",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "44",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "146",
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
    "started": "2024-11-20T21:10:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
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
