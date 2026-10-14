---
folio: "0.1"
id: "01JRYF13C0A9Z92FW2NSPW04HV"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00408500"
effective: "2025-04-16T03:16:00Z"
recorded: "2025-04-16T04:52:00Z"
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

**Reason for admission:** pneumonia with reduced oral intake and impaired kidney function on labs.

**History of present illness.** The patient was seen in the ED this afternoon with several days of cough, fatigue and shortness of breath with exertion. Workup in the ED was consistent with <ref id="dx_pneumonia">community-acquired pneumonia</ref>, and I am admitting for treatment and monitoring. The patient has been eating and drinking less than usual. Home medications were reviewed with the patient and the pharmacy list. No known drug allergies.

**Exam.** Vitals at 22:06: BP 114/68, HR 100, RR 23, T 98.9 F, SpO2 97%. Mildly tachypneic but speaking in full sentences. Coughing intermittently, with decreased breath sounds at the base on the affected side. Mucous membranes slightly dry. Abdomen soft and nontender.

**Results.** The basic metabolic panel drawn at 17:15 showed sodium 134, potassium 4.3, chloride 97, bicarbonate 23, anion gap 14, urea nitrogen 56, creatinine 1.69, eGFR 38 and glucose 148. Normal saline at 75 mL/h was started at 17:38 and is still running.

**Assessment and plan**

1. Community-acquired pneumonia: continue treatment as started in the ED, monitor oxygen saturation and respiratory rate, and reassess in the morning.
2. Elevated urea nitrogen and creatinine with reduced intake: continue IV fluids and repeat the metabolic panel in the morning. Avoid nephrotoxins.
3. Diabetes: <ref id="med_metformin">hold metformin during the acute illness</ref>, and <ref id="med_empagliflozin">hold empagliflozin while she is not eating</ref>, both to be resumed when able. Continue insulin glargine 10 units nightly.
4. Hypertension: continue lisinopril 40 mg daily; recheck creatinine and potassium in the morning.
5. Continue rosuvastatin 20 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6426033",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-04-15T21:48:00Z",
    "admitted": "2025-04-16T02:20:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-04-16T03:06:00Z",
    "bp": { "systolic_mmhg": 114, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 100,
    "resp_rate_per_min": 23,
    "temp_f": 98.9,
    "spo2_pct": 97,
    "weight_kg": 95.1
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
    "accession": "L25105-6684",
    "collected": "2025-04-15T22:15:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "134",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "97",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "56",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.69",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "38",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "148",
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
    "started": "2025-04-15T22:38:00Z"
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
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 50 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
