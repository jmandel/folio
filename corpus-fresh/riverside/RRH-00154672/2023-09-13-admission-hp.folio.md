---
folio: "0.1"
id: "01HA6QN9H0K6H3S8EYSS1Z77CJ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00154672"
effective: "2023-09-13T05:12:00Z"
recorded: "2023-09-13T07:39:00Z"
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

**Reason for admission:** <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>.

**History of present illness.** The patient came to the ED with nausea, malaise and fast breathing and was found to be acidotic with a glucose of 244. <ref id="precipitant">The ketoacidosis was precipitated by a weekend of heavy alcohol use with little food.</ref> At home they take an SGLT2 inhibitor once daily, along with the other medications below.

**Home medications.** Metformin 1000 mg twice daily with meals, losartan 100 mg daily, glipizide 5 mg daily, dulaglutide 0.5 mg weekly, insulin glargine 14 units nightly and rosuvastatin 20 mg nightly. Allergy: lisinopril (cough).

**Exam.** BP 124/74, HR 100, RR 18, T 98 F, SpO2 95% at 00:02. Mildly dry mucous membranes. Abdomen soft.

**Results.** Sodium 135, potassium 5.5, chloride 95, bicarbonate 8, anion gap 32, urea nitrogen 26, creatinine 0.99, eGFR 64, glucose 244 on the 18:26 panel. Lipase 26.

**Assessment and plan**

1. Euglycemic DKA: continue the insulin infusion per DKA protocol (started 19:05) with D5 lactated Ringer's at 150 mL/h, since glucose is modest. Repeat chemistries through the night.
2. <ref id="med_empagliflozin">Hold empagliflozin 10 mg daily.</ref>
3. <ref id="med_metformin">Hold metformin</ref> while acidotic and NPO.
4. <ref id="med_losartan">Hold losartan</ref> for volume depletion and the elevated potassium; resume when eating.
5. <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 26.
6. Glipizide, dulaglutide, glargine and rosuvastatin are listed as continue.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6139885",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-09-12T22:55:00Z",
    "admitted": "2023-09-13T04:27:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-09-13T05:02:00Z",
    "bp": { "systolic_mmhg": 124, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 100,
    "resp_rate_per_min": 18,
    "temp_f": 98,
    "spo2_pct": 95,
    "weight_kg": 68.2
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
    "accession": "L23255-7879",
    "collected": "2023-09-12T23:26:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "26",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23255-5835",
    "collected": "2023-09-12T23:26:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.5",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "95",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "8",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "LL"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "32",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "26",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.99",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "64",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "244",
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
    "started": "2023-09-13T00:05:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2023-09-13T00:05:00Z"
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
  "med_dulaglutide": {
    "type": "home_med",
    "drug_name": "dulaglutide pen",
    "rxnorm_ingredient": "1551291",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
    "status": "continue"
  },
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "14 units",
    "sig": "14 units SubQ nightly",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold for volume depletion and potassium; resume when eating"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
