# Feedback: counterexamples from expected outputs

Your mapper was run on other patients of this source and compared with the expected output. 7 rows were wrong
in total; a varied selection follows, with the items involved (full Markdown). Fix the mapper so it reads the data
correctly in general, not only for these patients.

## Patient RRH-00594395, allergies `dapagliflozin`

- expected a row, mapper has none

## Patient RRH-00594395, allergies `{"substance":"SGLT2 inhibitor","type":"adverse_reaction","reaction":"Euglycemic DKA, SGLT2 inhibitor-associated","criticality":"high","evidence":[{"item_id":"01JDZQGW90GVGBZYMZNK7GBYP7","entry_id":"dx`

- mapper row with no counterpart in the expected output

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JDZQGW90GVGBZYMZNK7GBYP7"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00594395"
effective: "2024-11-28T02:05:00Z"
effective_end: "2024-11-30T20:45:00Z"
recorded: "2024-11-30T23:47:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis:** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved.</ref>

**Hospital course.** The patient is a man with type 2 diabetes, hypertension and chronic kidney disease who presented on 11/27 with ketoacidosis and a glucose of 183. He was treated with an insulin infusion per DKA protocol and IV fluids, and then transitioned to subcutaneous insulin. His gap closed and his bicarbonate normalized. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. Endocrinology saw him in consultation.

**Condition at discharge.** Vitals at 11:45: BP 122/73, HR 89, RR 20, T 98.8 F, SpO2 97%. On the 06:28 panel on 11/30: sodium 133, potassium 4.1, chloride 99, bicarbonate 23, anion gap 11, urea nitrogen 14, creatinine 2.29, eGFR 35, glucose 178. Creatinine has improved from 2.83 on admission but remains elevated.

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily: do not resume until reviewed by his PCP.</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue.</ref>
- <ref id="med_losartan">Losartan 100 mg daily: continue.</ref>
- Atorvastatin 20 mg nightly: continue.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week, to decide whether to restart dapagliflozin and to recheck a basic metabolic panel.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6654902",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-27T21:41:00Z",
    "admitted": "2024-11-28T02:05:00Z",
    "discharged": "2024-11-30T20:45:00Z",
    "disposition": "home"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-11-30T17:45:00Z",
    "bp": { "systolic_mmhg": 122, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 89,
    "resp_rate_per_min": 20,
    "temp_f": 98.8,
    "spo2_pct": 97,
    "weight_kg": 89
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24335-0583",
    "collected": "2024-11-30T12:28:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.1", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "14", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.29",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "35",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "178",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
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
    "status": "continue"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart dapagliflozin; recheck basic metabolic panel"
  }
}
```
````
</details>

## Patient RRH-00605325, allergies `lisinopril`

- expected a row, mapper has none

## Patient RRH-00905172, allergies `{"substance":"SGLT2 inhibitor","type":"adverse_reaction","reaction":"Euglycemic DKA, SGLT2 inhibitor-associated","criticality":"high","evidence":[{"item_id":"01JB8BV6V07B9AJWV4P2P3JAK8","entry_id":"dx`

- mapper row with no counterpart in the expected output

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JB8BV6V07B9AJWV4P2P3JAK8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00905172"
effective: "2024-10-26T04:15:00Z"
effective_end: "2024-10-27T20:30:00Z"
recorded: "2024-10-28T01:29:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis:** <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>, resolved.

**Hospital course.** The patient came in with nausea, fatigue and fast breathing and was found to have a wide-gap metabolic acidosis with a near-normal glucose. <ref id="precipitant">The ketoacidosis was precipitated by a weekend of heavy alcohol use with little food.</ref> He was treated with an insulin infusion and dextrose-containing fluids, followed by subcutaneous insulin, and his acidosis cleared. He ate normally before discharge.

**Condition at discharge.** Vitals at 12:30: BP 125/75, HR 88, RR 20, T 98.6 F, SpO2 96%. He feels well. The final panel on 10/27 at 06:22 showed sodium 132, potassium 4.3, chloride 100, bicarbonate 19, anion gap 13, urea nitrogen 20, creatinine 0.76, eGFR 80 and glucose 184.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily: do not resume until reviewed by his PCP</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue</ref>
- <ref id="med_lisinopril">Lisinopril 20 mg daily: continue</ref>
- Glipizide 5 mg daily: continue
- Amlodipine 5 mg daily: continue

**Follow-up.** He will see his primary care physician at Northgate Family Medicine within 1 week to decide whether dapagliflozin should be restarted and to recheck a basic metabolic panel. He was advised to return for vomiting, abdominal pain, fast breathing or marked weakness.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6697396",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-10-26T01:05:00Z",
    "admitted": "2024-10-26T04:15:00Z",
    "discharged": "2024-10-27T20:30:00Z",
    "disposition": "home"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-10-27T17:30:00Z",
    "bp": { "systolic_mmhg": 125, "diastolic_mmhg": 75 },
    "heart_rate_bpm": 88,
    "resp_rate_per_min": 20,
    "temp_f": 98.6,
    "spo2_pct": 96,
    "weight_kg": 81.5
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24301-2005",
    "collected": "2024-10-27T11:22:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "13", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "20", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.76",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "80",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "184",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
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
    "status": "continue"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
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
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart dapagliflozin; recheck basic metabolic panel"
  }
}
```
````
</details>

## Patient RRH-00905172, allergies `dapagliflozin`

- expected a row, mapper has none

## Patient RRH-00020584, allergies `{"substance":"SGLT2 inhibitor","type":"adverse_reaction","reaction":"Euglycemic DKA, SGLT2 inhibitor-associated","criticality":"high","evidence":[{"item_id":"01J77BAS60XX3Q29QFCHJJW5NM","entry_id":"dx`

- mapper row with no counterpart in the expected output

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01J77BAS60XX3Q29QFCHJJW5NM"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00020584"
effective: "2024-09-04T04:37:00Z"
effective_end: "2024-09-07T19:30:00Z"
recorded: "2024-09-07T22:58:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnoses.** <ref id="dx_dka">Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated, resolved.</ref> <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref> with a normal lipase of 30.

**Hospital course.** The patient came to the ED with nausea, fatigue and deep, fast breathing, and was found to have a severe anion gap acidosis with a glucose of only 186. They take empagliflozin at home. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. They were treated with an insulin infusion and D5 lactated Ringer's, then transitioned to subcutaneous glargine. The anion gap closed by the morning of 9/4. Sodium was 128 on arrival and has stayed mildly low, 131 on the day of discharge.

**Condition at discharge.** Vitals at 11:30: BP 121/73, HR 98, RR 19, T 98.9 F, SpO2 96%. The final panel at 06:02 on 9/7 shows sodium 131, potassium 4.2, chloride 98, bicarbonate 22, anion gap 11, urea nitrogen 18, creatinine 0.80, eGFR 80 and glucose 167. The patient is eating and walking without symptoms. Allergies: NKDA.

**Discharge medications**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: do not resume until reviewed by the primary care physician.</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue.</ref>
- <ref id="med_losartan">Losartan 100 mg daily: continue.</ref>
- <ref id="med_furosemide">Furosemide 40 mg daily: continue.</ref>
- Carvedilol 12.5 mg twice daily: continue.
- Spironolactone 25 mg daily: continue.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week, to decide whether to restart empagliflozin and to recheck a basic metabolic panel.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6196344",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-09-03T23:48:00Z",
    "admitted": "2024-09-04T04:37:00Z",
    "discharged": "2024-09-07T19:30:00Z",
    "disposition": "home"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "dx_pancreatitis": {
    "type": "diagnosis",
    "label": "Acute pancreatitis",
    "icd10cm": "K85.90",
    "status": "ruled_out",
    "rank": "secondary"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-09-07T16:30:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 98,
    "resp_rate_per_min": 19,
    "temp_f": 98.9,
    "spo2_pct": 96,
    "weight_kg": 77.5
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24251-6885",
    "collected": "2024-09-07T11:02:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "98", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.80",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "80",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "167",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
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
    "status": "continue"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_carvedilol": {
    "type": "home_med",
    "drug_name": "carvedilol 12.5 mg tablet",
    "rxnorm_ingredient": "20352",
    "dose_text": "12.5 mg",
    "sig": "1 tab PO BID",
    "status": "continue"
  },
  "med_spironolactone": {
    "type": "home_med",
    "drug_name": "spironolactone 25 mg tablet",
    "rxnorm_ingredient": "9997",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_furosemide": {
    "type": "home_med",
    "drug_name": "furosemide 40 mg tablet",
    "rxnorm_ingredient": "4603",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart empagliflozin; recheck basic metabolic panel"
  }
}
```
````
</details>

## Patient RRH-00042445, allergies `lisinopril`

- expected a row, mapper has none
