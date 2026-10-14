---
folio: "0.1"
id: "01J751SW70AYBBH88QGY1QAA5R"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00465990"
effective: "2024-09-06T23:34:00Z"
recorded: "2024-09-07T01:33:00Z"
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

**Reason for admission:** community-acquired pneumonia.

**History of present illness.** The patient was seen in the ED this afternoon with a cough and feeling unwell and short of breath with exertion, and has been admitted for treatment and observation. Intake has been reduced over the last few days. Blood work in the ED showed kidney function worse than expected, and intravenous fluids were started at 13:55.

**Home medications.** Metformin 1000 mg twice daily with meals, empagliflozin 10 mg daily, lisinopril 40 mg daily and amlodipine 5 mg daily. Lisinopril and amlodipine are continued.

**Allergies:** no known drug allergies.

**Exam.** On the 18:24 vitals: BP 115/69, HR 105, RR 24, T 98.5 F, SpO2 94%. Mildly tachypneic and slightly tired-appearing but conversant in full sentences. Heart rate regular and slightly fast. Abdomen soft.

**Results.** The 13:30 basic metabolic panel showed sodium 132, potassium 4.7, chloride 99, bicarbonate 21, anion gap 12, urea nitrogen 30, creatinine 2.70, eGFR 28 and glucose 125.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Continue ceftriaxone as started in the ED. Monitor respiratory rate and oxygen saturation closely overnight.
2. Kidney function: creatinine 2.70 with low sodium and bicarbonate, in the setting of poor intake. Continue normal saline at 75 mL/h and repeat the metabolic panel in the morning.
3. Diabetes: <ref id="med_metformin">hold metformin</ref> during the acute illness given the creatinine, and <ref id="med_empagliflozin">hold empagliflozin</ref> while she is not eating. Resume both when able.
4. Hypertension: BP is acceptable. Continue lisinopril and amlodipine at home doses.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6373676",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-09-06T18:05:00Z",
    "admitted": "2024-09-06T22:28:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-09-06T23:24:00Z",
    "bp": { "systolic_mmhg": 115, "diastolic_mmhg": 69 },
    "heart_rate_bpm": 105,
    "resp_rate_per_min": 24,
    "temp_f": 98.5,
    "spo2_pct": 94,
    "weight_kg": 89.7
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
    "accession": "L24250-8001",
    "collected": "2024-09-06T18:30:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.7", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.70",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "28",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "125",
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
    "started": "2024-09-06T18:55:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
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
