---
folio: "0.1"
id: "01JBYAAES035K0A0QM0RXD72CX"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00731846"
effective: "2024-11-05T13:30:00Z"
recorded: "2024-11-05T14:05:40Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Hospital day 5 progress note

**Interval.** Ms. Okafor slept well and has no complaints. She is eating her meals and walking in the hall. Hyponatremia is still being followed and is improving.

**Exam.** Comfortable, afebrile. Heart regular, lungs clear. Abdomen soft and nontender.

**Results.** On the 06:00 panel: <ref id="bmp">sodium 133, potassium 4.3, chloride 101, bicarbonate 23, anion gap 9, urea nitrogen 14, creatinine 1.33, eGFR 46, glucose 136</ref>. Bicarbonate and anion gap are normal, sodium is a point higher than yesterday, and creatinine is drifting toward her usual.

**Assessment and plan**

1. <ref id="dx_edka">Euglycemic DKA, SGLT2 inhibitor-associated, is resolved.</ref> Her labs have stayed normal without the ketoacidosis returning.
2. <ref id="med_empa">Empagliflozin remains held</ref>, since it was the likely cause of this episode.
3. <ref id="med_metformin">Metformin remains held</ref> for now.
4. Losartan and chlorthalidone remain held while sodium and creatinine continue to recover. Atorvastatin continues.
5. Continue daily labs and encourage oral intake.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6620417",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-02T02:40:00Z",
    "admitted": "2024-11-02T06:30:00Z"
  },
  "dx_edka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "dx_na": {
    "type": "diagnosis",
    "label": "Hyponatremia",
    "icd10cm": "E87.1",
    "status": "active",
    "rank": "secondary"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24310-0051",
    "collected": "2024-11-05T12:00:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "133",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "14", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.33",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "46",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "136",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "14 units daily",
    "started": "2024-11-03T13:00:00Z",
    "stopped": "2024-11-05T14:00:00Z"
  },
  "sc_lispro": {
    "type": "inpatient_med",
    "drug_name": "insulin lispro correction scale",
    "rxnorm_ingredient": "86009",
    "route": "SubQ",
    "dose_text": "low-dose correction scale before meals",
    "started": "2024-11-03T15:00:00Z",
    "stopped": "2024-11-05T14:00:00Z"
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
    "status": "held"
  },
  "med_empa": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
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
