---
folio: "0.1"
id: "01GB9RGHV05NMP1Z0283X01T0Q"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00269656"
effective: "2022-08-25T03:35:00Z"
recorded: "2022-08-25T05:45:00Z"
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

**Reason for admission:** pneumonia.

**History of present illness.** The patient is a woman with type 2 diabetes, hypertension and chronic kidney impairment who came to the ED this afternoon after several days of cough productive of yellow sputum, fever at home, and worsening breathlessness with walking. She felt too tired to eat well over the last two days. She was started on intravenous saline in the ED and was brought to the floor for further treatment.

**Allergies:** lisinopril (angioedema).

**Home medications.** Glipizide 5 mg daily, amlodipine 10 mg daily and atorvastatin 20 mg nightly are on her home list. Metformin 1000 mg twice daily with meals is also on the list; see the plan below.

**Exam.** Vitals at 22:25: BP 131/79, HR 91, RR 22, T 98.9 F, SpO2 94%. She is tired but comfortable at rest and speaks in full sentences. Breath sounds are coarse at the right base with a few crackles. Heart sounds are regular. Abdomen is soft and nontender. No leg swelling.

**Results.** The 18:24 panel showed sodium 135, potassium 4.2, chloride 100, bicarbonate 22, anion gap 13, urea nitrogen 33, creatinine 1.70, eGFR 43 and glucose 192.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Her cough, fever, respiratory rate of 22 and saturation of 94% fit this picture. Recheck vitals overnight and watch her oxygen saturation.
2. Kidney function is worse than expected, with creatinine 1.70, most likely from poor intake and fever. Normal saline continues at 75 mL/h, started 18:55. Repeat the panel in the morning and avoid nephrotoxins.
3. Diabetes: glucose 192 on the panel. <ref id="med_metformin">Hold metformin during the acute illness</ref>, given the creatinine; it can be resumed when she is able. Glipizide continues.
4. Hypertension and lipids: blood pressure is acceptable tonight. Atorvastatin continues.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6036136",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-08-24T23:05:00Z",
    "admitted": "2022-08-25T02:45:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-08-25T03:25:00Z",
    "bp": { "systolic_mmhg": 131, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 22,
    "temp_f": 98.9,
    "spo2_pct": 94,
    "weight_kg": 101
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
    "accession": "L22236-5122",
    "collected": "2022-08-24T23:24:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "135",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.2", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "13", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "33",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.70",
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
        "value": "192",
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
    "started": "2022-08-24T23:55:00Z"
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
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
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
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
