---
folio: "0.1"
id: "01GA2PBNK0QYY69BC95SZ96K17"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00517408"
effective: "2022-08-09T23:42:00Z"
recorded: "2022-08-10T01:37:00Z"
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

**Reason for admission:** <ref id="dx_pneumonia">community-acquired pneumonia</ref>.

**History.** The patient was seen in the emergency department this afternoon and is admitted for treatment of pneumonia. Symptoms leading to the visit were cough and feeling unwell, and the patient was found to be tachycardic and mildly tachypneic on arrival. Home medications include losartan, chlorthalidone and atorvastatin. Allergies: no known drug allergies.

**Exam.** Vitals at 18:32: BP 107/64, HR 85, RR 22, T 99.1 F, SpO2 96%. The patient is comfortable, speaking in full sentences, and not in distress. Breathing is slightly quick, and the chest exam is consistent with the pneumonia seen in the ED. Abdomen soft.

**Results.** Basic metabolic panel drawn 13:48: sodium 134 (L), potassium 4.3, chloride 100, bicarbonate 16 (L), anion gap 18 (H), urea nitrogen 47 (H), creatinine 1.75 (H), eGFR 43 (L), glucose 154 (H). Normal saline has been running at 75 mL/h since 14:10 and will continue for now.

**Assessment and plan**

1. Community-acquired pneumonia, active. Continue treatment as started in the ED, and monitor vital signs and oxygen saturation, which is 96% at present. Repeat the basic metabolic panel in the morning to follow the creatinine and bicarbonate.
2. Hypertension: blood pressure is soft-normal at 107/64. <ref id="med_losartan">Hold losartan 100 mg daily until creatinine is back to baseline</ref>, then resume when able.
3. Chlorthalidone 12.5 mg daily: continue.
4. Atorvastatin 40 mg nightly: continue.
5. Allergies: no known drug allergies.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6944313",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-08-09T18:20:00Z",
    "admitted": "2022-08-09T22:36:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-08-09T23:32:00Z",
    "bp": { "systolic_mmhg": 107, "diastolic_mmhg": 64 },
    "heart_rate_bpm": 85,
    "resp_rate_per_min": 22,
    "temp_f": 99.1,
    "spo2_pct": 96,
    "weight_kg": 86.9
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
    "accession": "L22221-6741",
    "collected": "2022-08-09T18:48:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "16",
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
        "value": "47",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.75",
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
        "value": "154",
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
    "started": "2022-08-09T19:10:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
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
