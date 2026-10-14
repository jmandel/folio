# Feedback: counterexamples from expected outputs

Your mapper was run on other patients of this source and compared with the expected output. 4 rows were wrong
in total; a varied selection follows, with the items involved (full Markdown). Fix the mapper so it reads the data
correctly in general, not only for these patients.

## Patient RRH-00594395, allergies `{"criticality":"high","evidence":[{"item_id":"01JDZQGW90GVGBZYMZNK7GBYP7","entry_id":"dx_dka"},{"item_id":"01JDW6GHM0WA57V87GKJ4AW5YQ","entry_id":"dx_dka"},{"item_id":"01JDTBB7P0NJEQ37BK2AZ88019","ent`

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

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JDW6GHM0WA57V87GKJ4AW5YQ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00594395"
effective: "2024-11-29T13:31:00Z"
recorded: "2024-11-29T14:52:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval history.** No complaints overnight. He is eating.

**Exam.** Vitals at 07:11: BP 135/81, HR 103, RR 19, T 98.5 F, SpO2 98%. Comfortable.

**Results.** <ref id="bmp">On the 06:12 panel: sodium 136, potassium 4.0, chloride 101, bicarbonate 23, anion gap 12, urea nitrogen 15, creatinine 2.47, eGFR 32, glucose 155.</ref> The acidosis has not returned.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, resolving. Continue <ref id="sc_glargine">insulin glargine 18 units subcutaneously daily</ref>.
2. Creatinine 2.47, eGFR 32, essentially unchanged from yesterday; we will keep following it. Metformin, dapagliflozin and losartan remain held.
3. Continue atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6654902",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-27T21:41:00Z",
    "admitted": "2024-11-28T02:05:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-11-29T13:11:00Z",
    "bp": { "systolic_mmhg": 135, "diastolic_mmhg": 81 },
    "heart_rate_bpm": 103,
    "resp_rate_per_min": 19,
    "temp_f": 98.5,
    "spo2_pct": 98,
    "weight_kg": 89
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24334-0658",
    "collected": "2024-11-29T12:12:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "15", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.47",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "32",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "155",
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
    "dose_text": "18 units daily",
    "started": "2024-11-28T13:00:00Z"
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
    "status": "held"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "held"
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
````
</details>

## Patient RRH-00605325, allergies `{"criticality":"high","evidence":[{"item_id":"01JAC693Q01AJZEY7TW6HHJFZF","entry_id":"dx_angioedema"},{"item_id":"01JAC693Q01AJZEY7TW6HHJFZF","entry_id":"med_lisinopril"}],"onset":{"value":"2024-10-16`

- mapper row with no counterpart in the expected output

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JAC693Q01AJZEY7TW6HHJFZF"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00605325"
effective: "2024-10-16T22:48:00Z"
recorded: "2024-10-17T02:53:00Z"
author:
  id: "urn:riverside-regional:staff:40561"
  name: "Erik Lindqvist, DO"
  role: "Emergency physician"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Emergency department provider note

**Chief complaint.** Swelling of the lips and face.

**History.** The patient presented this afternoon with swelling of the lips and face that came on over the past several hours. There was no rash and no itching. They were able to swallow and speak, and reported no difficulty breathing. They take lisinopril 10 mg daily, along with metformin 1000 mg twice daily with meals, amlodipine 5 mg daily and rosuvastatin 20 mg nightly. Allergies: no known drug allergies.

**Exam.** Vitals at 17:54: BP 143/86, HR 85, RR 20, T 98.1 F, SpO2 96%. Visible swelling of the lips and lower face without hives. Voice clear, no stridor, handling secretions. Lungs clear. Heart regular.

**Course in the department.** Methylprednisolone 125 mg IV was given once at 18:13. The patient was watched closely for any change in the airway or voice.

**Assessment and plan**

1. <ref id="dx_angioedema">Angioedema, ACE inhibitor-associated</ref>. The swelling without hives or itching fits a bradykinin-mediated process in a patient taking an ACE inhibitor. <ref id="med_lisinopril">Lisinopril is stopped: do not take lisinopril or any ACE inhibitor again.</ref> The patient was told this plainly, and it should be recorded in their chart so that no ACE inhibitor is prescribed in the future.
2. The patient was advised to return immediately for any worsening swelling, trouble swallowing, change in voice, or difficulty breathing, and to follow up with their primary care physician.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6426047",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2024-10-16T22:48:00Z",
    "disposition": "home"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-10-16T22:54:00Z",
    "bp": { "systolic_mmhg": 143, "diastolic_mmhg": 86 },
    "heart_rate_bpm": 85,
    "resp_rate_per_min": 20,
    "temp_f": 98.1,
    "spo2_pct": 96,
    "weight_kg": 73.9
  },
  "dx_angioedema": {
    "type": "diagnosis",
    "label": "Angioedema, ACE inhibitor-associated",
    "icd10cm": "T78.3XXA",
    "status": "active"
  },
  "iv_methylpred": {
    "type": "inpatient_med",
    "drug_name": "methylprednisolone IV",
    "rxnorm_ingredient": "6902",
    "route": "IV",
    "dose_text": "125 mg once",
    "started": "2024-10-16T23:13:00Z",
    "stopped": "2024-10-16T23:14:00Z"
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
    "status": "not_reconciled"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "stopped",
    "instructions": "Do not take lisinopril or any ACE inhibitor again"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "not_reconciled"
  }
}
```
````
</details>

## Patient RRH-00905172, allergies `{"criticality":"high","evidence":[{"item_id":"01JB8BV6V07B9AJWV4P2P3JAK8","entry_id":"dx_dka"},{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"dx_dka"},{"item_id":"01JB3V84E05M8V4MRJD29Q4E1M","ent`

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

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JB4HSJC067DHTGC4YKE0WV02"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00905172"
effective: "2024-10-26T12:36:00Z"
recorded: "2024-10-26T13:56:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval.** He slept some overnight and feels better this morning, with less nausea and easier breathing. Vitals at 07:16: BP 126/76, HR 105, RR 20, T 98.8 F, SpO2 95%.

**Results.** On the <ref id="bmp">06:09 panel sodium is 132, potassium 3.9, chloride 104, bicarbonate 19, anion gap 9, urea nitrogen 22, creatinine 0.83, eGFR 72 and glucose 164</ref>. The anion gap has closed from 27 at presentation.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, improving, with the gap now closed. The <ref id="iv_insulin">insulin infusion per DKA protocol at 0.1 units/kg/h</ref> is still running. <ref id="sc_glargine">Insulin glargine 18 units subcutaneously daily was started at 07:00</ref> to overlap with the infusion. Continue to watch the chemistries.
2. Metformin, dapagliflozin and lisinopril remain held. Glipizide and amlodipine continue as listed.
3. No known drug allergies.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6697396",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-10-26T01:05:00Z",
    "admitted": "2024-10-26T04:15:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-10-26T12:16:00Z",
    "bp": { "systolic_mmhg": 126, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 105,
    "resp_rate_per_min": 20,
    "temp_f": 98.8,
    "spo2_pct": 95,
    "weight_kg": 81.5
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24300-9462",
    "collected": "2024-10-26T11:09:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.83",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "72",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "164",
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
    "started": "2024-10-26T02:15:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "18 units daily",
    "started": "2024-10-26T12:00:00Z"
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
    "status": "held"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
````
</details>

## Patient RRH-00042445, allergies `{"criticality":"high","evidence":[{"item_id":"01J9FHFYN022XMP813A6DRS7EK","entry_id":"dx_angioedema"},{"item_id":"01J9FHFYN022XMP813A6DRS7EK","entry_id":"med_lisinopril"}],"onset":{"value":"2024-10-05`

- mapper row with no counterpart in the expected output

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01J9FHFYN022XMP813A6DRS7EK"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00042445"
effective: "2024-10-05T20:34:00Z"
recorded: "2024-10-05T23:51:00Z"
author:
  id: "urn:riverside-regional:staff:40561"
  name: "Erik Lindqvist, DO"
  role: "Emergency physician"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Emergency department provider note

**History.** The patient presented to the ED with swelling of the lips and face that developed over the course of the day. They describe the lips as feeling thick and tight. They report no hives and no itching, and they have had no new foods, new soaps or insect stings. They are taking lisinopril for blood pressure and have no earlier episode like this. Their allergy list reads NKDA.

**Home medications.** <ref id="med_lisinopril">Lisinopril 10 mg by mouth daily is stopped; the patient is instructed not to take lisinopril or any ACE inhibitor again</ref>. The other home medications are metformin 1000 mg twice daily with meals, empagliflozin 10 mg daily, glipizide 5 mg daily, amlodipine 5 mg daily, carvedilol 12.5 mg twice daily, spironolactone 25 mg daily, furosemide 40 mg daily and atorvastatin 40 mg nightly. These have not yet been reconciled and are listed here as the patient reports taking them.

**Exam.** Vitals at 15:40: BP 132/79, HR 91, RR 20, temperature 98.8 F, SpO2 95%. The patient is awake, speaking in full sentences and handling their secretions. There is visible swelling of the lips, without a rash. Breathing is unlabored at rest and there is no stridor.

**Assessment and plan**

1. <ref id="dx_angioedema">Angioedema, ACE inhibitor-associated</ref>. The swelling is isolated to the lips and face, with no hives and no airway compromise at this time, which fits a bradykinin-mediated process from the ACE inhibitor rather than an allergic reaction. Methylprednisolone 125 mg IV was given once, started 15:59. The airway will be watched closely with repeated reassessment, and the patient will be kept under observation until the swelling is clearly improving. Lisinopril is discontinued permanently, and the patient and family were told plainly that no ACE inhibitor should be taken again.
2. Other home medications: not yet reconciled. This will be completed with the patient and the pharmacy list before disposition.

The patient understands the plan and agrees with it. They were asked to tell the nurse right away about any trouble breathing or swallowing, or any change in the voice.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6284749",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2024-10-05T20:34:00Z",
    "disposition": "home"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-10-05T20:40:00Z",
    "bp": { "systolic_mmhg": 132, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 20,
    "temp_f": 98.8,
    "spo2_pct": 95,
    "weight_kg": 93.7
  },
  "dx_angioedema": {
    "type": "diagnosis",
    "label": "Angioedema, ACE inhibitor-associated",
    "icd10cm": "T78.3XXA",
    "status": "active"
  },
  "iv_methylpred": {
    "type": "inpatient_med",
    "drug_name": "methylprednisolone IV",
    "rxnorm_ingredient": "6902",
    "route": "IV",
    "dose_text": "125 mg once",
    "started": "2024-10-05T20:59:00Z",
    "stopped": "2024-10-05T21:00:00Z"
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
    "status": "not_reconciled"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "stopped",
    "instructions": "Do not take lisinopril or any ACE inhibitor again"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_carvedilol": {
    "type": "home_med",
    "drug_name": "carvedilol 12.5 mg tablet",
    "rxnorm_ingredient": "20352",
    "dose_text": "12.5 mg",
    "sig": "1 tab PO BID",
    "status": "not_reconciled"
  },
  "med_spironolactone": {
    "type": "home_med",
    "drug_name": "spironolactone 25 mg tablet",
    "rxnorm_ingredient": "9997",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_furosemide": {
    "type": "home_med",
    "drug_name": "furosemide 40 mg tablet",
    "rxnorm_ingredient": "4603",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "not_reconciled"
  }
}
```
````
</details>
