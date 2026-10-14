---
folio: "0.1"
id: "01JBSJ3HMG6CQ643DZVMXXQKFB"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00731846"
effective: "2024-11-03T16:20:00Z"
recorded: "2024-11-03T17:45:30Z"
author:
  id: "urn:riverside-regional:staff:22905"
  name: "Elena Vasquez, MD"
  role: "Endocrinologist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Endocrinology consult

**Requested by** Dr. Raman, Hospital Medicine, for euglycemic DKA and future diabetes therapy.

**History.** 59-year-old woman with type 2 diabetes since 2016, on metformin and empagliflozin, admitted
with ketoacidosis after several days of vomiting and very little food. Admission glucose was 182 with
<ref id="bhb_1">beta-hydroxybutyrate 6.2</ref>. Never on insulin; no prior DKA.

**Course.** <ref id="bhb_2">Beta-hydroxybutyrate 2.1</ref> at midday yesterday and
<ref id="bhb_3">0.3 this morning</ref>. <ref id="bmp_am">Anion gap 11 and bicarbonate 21 on the 06:10
panel</ref>. With the gap closed she was given <ref id="sc_glargine">insulin glargine 14 units</ref> at
07:00, and the <ref id="iv_insulin">insulin infusion</ref> was stopped two hours later, at 09:00. She is
now on glargine with <ref id="sc_lispro">correction-scale insulin lispro</ref> and tolerating clear
liquids.

**Assessment.** <ref id="dx_edka">Euglycemic DKA due to empagliflozin, now resolved</ref>. The
precipitant was the combination of an SGLT2 inhibitor with acute illness and near-fasting; nothing
suggests type 1 diabetes or insulin deficiency beyond that.

**Recommendations**

1. <ref id="med_empa">Do not restart empagliflozin or any other SGLT2 inhibitor at discharge.</ref> If
   her nephrologist later wants an SGLT2 inhibitor for kidney protection, that should be a deliberate
   decision with written sick-day guidance in place first.
2. <ref id="med_metformin">Metformin can resume</ref> once she is eating and creatinine is stable.
3. Continue glargine 14 units daily while inpatient. No basal insulin needed at discharge if glucose
   stays under 200 on metformin.
4. A1c with her next outpatient labs.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6620417",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-11-02T02:40:00Z",
    "admitted": "2024-11-02T06:30:00Z"
  },
  "dx_edka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved"
  },
  "bhb_1": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L24306-0414",
    "collected": "2024-11-02T02:58:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.2",
    "unit": "mmol/L",
    "ref_range": "<0.4",
    "flag": "HH"
  },
  "bhb_2": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L24307-0233",
    "collected": "2024-11-02T17:05:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "2.1",
    "unit": "mmol/L",
    "ref_range": "<0.4",
    "flag": "H"
  },
  "bhb_3": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L24308-0098",
    "collected": "2024-11-03T12:10:00Z",
    "specimen": "serum",
    "status": "preliminary",
    "value": "0.3",
    "unit": "mmol/L",
    "ref_range": "<0.4"
  },
  "bmp_am": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24308-0097",
    "collected": "2024-11-03T12:10:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.2", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "19", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.36",
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
        "value": "148",
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
    "started": "2024-11-02T04:05:00Z",
    "stopped": "2024-11-03T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "14 units daily",
    "started": "2024-11-03T13:00:00Z"
  },
  "sc_lispro": {
    "type": "inpatient_med",
    "drug_name": "insulin lispro correction scale",
    "rxnorm_ingredient": "86009",
    "route": "SubQ",
    "dose_text": "low-dose correction scale before meals",
    "started": "2024-11-03T15:00:00Z"
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
    "instructions": "May resume when eating and creatinine stable"
  },
  "med_empa": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Recommend against restarting at discharge"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "held"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
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
