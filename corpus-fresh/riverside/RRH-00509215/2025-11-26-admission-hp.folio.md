---
folio: "0.1"
id: "01KAZKGA40W0GWFZYE2AF8DDJ3"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00509215"
effective: "2025-11-26T06:42:00Z"
recorded: "2025-11-26T08:12:00Z"
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

**Reason for admission:** euglycemic diabetic ketoacidosis.

**History of present illness.** The patient presented to the ED the evening of 11/25 with nausea, fatigue and fast breathing and was found to be acidotic with a glucose of 217. <ref id="precipitant">The ketoacidosis was precipitated by prolonged fasting for religious observance while continuing the SGLT2 inhibitor.</ref> They have been taking the medication daily at home.

**Allergies:** lisinopril (angioedema).

**Exam.** BP 113/68, HR 95, RR 20, T 98.1 F, SpO2 96% at 00:32. Mucous membranes dry, breathing somewhat deep. Abdomen soft and nontender.

**Results.** The 19:26 panel showed sodium 131 (L), potassium 4.7, chloride 99, bicarbonate 9 (LL), anion gap 23 (H), urea nitrogen 38 (H), creatinine 0.98, eGFR 67 and glucose 217 (H). Lipase 42.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. Continue the insulin infusion per DKA protocol (0.1 units/kg/h, started 20:15) with D5 lactated Ringer's at 150 mL/h, since glucose is not high. <ref id="med_empagliflozin">Hold empagliflozin 10 mg daily.</ref> <ref id="med_metformin">Hold metformin while acidotic and NPO; resume when able.</ref>
2. <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 42.
3. Hyponatremia, sodium 131, likely from volume depletion; expect improvement with fluids.
4. Home glipizide 5 mg daily, insulin glargine 10 units nightly and amlodipine 10 mg daily are continued.
5. Lisinopril allergy (angioedema) noted; avoid.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6243308",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-11-26T01:05:00Z",
    "admitted": "2025-11-26T05:35:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-11-26T06:32:00Z",
    "bp": { "systolic_mmhg": 113, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 95,
    "resp_rate_per_min": 20,
    "temp_f": 98.1,
    "spo2_pct": 96,
    "weight_kg": 101.7
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "dx_pancreatitis": {
    "type": "diagnosis",
    "label": "Acute pancreatitis",
    "icd10cm": "K85.90",
    "status": "ruled_out",
    "rank": "secondary"
  },
  "lipase": {
    "type": "result",
    "test": { "local_code": "LIPASE", "loinc": "3040-3", "name": "Lipase" },
    "accession": "L25329-7347",
    "collected": "2025-11-26T01:26:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "42",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25329-2762",
    "collected": "2025-11-26T01:26:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.7", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "9",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "LL"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "38",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.98",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "67",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "217",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2025-11-26T02:15:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2025-11-26T02:15:00Z"
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
    "instructions": "Hold while acidotic and NPO"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
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
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
