# Feedback from an independent prose check

A separate reader looked only at the narrative text (with its ref spans) of some items from other patients of this
source, wrote down the facts each narrative asserts, and compared them with what your mapper returned for that patient
as of the item's date. 16 discrepancies are listed below, each with the item it came from (full Markdown).
The reader can be wrong (narratives mention plans, other organizations' decisions, or round numbers); the schema is
the authority. For each one, decide whether your mapper misreads the data and fix the mapper where it does.

## Patient RRH-00042445, as of 2024-10-05: missing

- Narrative says (item 01J9FHFYN022XMP813A6DRS7EK, ref `dx_angioedema`): {"view":"problems","condition":"Angioedema, ACE inhibitor-associated","status":"active","ref":"dx_angioedema"}
- Quote: "Angioedema, ACE inhibitor-associated"
- Your mapper: no matching row

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

## Patient RRH-00738611, as of 2024-06-27: value

- Narrative says (item 01J1C2ZDA0TYTTM11347HN7791): {"view":"vitals","systolic_mmhg":135,"diastolic_mmhg":81,"ref":null}
- Quote: "BP 135/81"
- Your mapper: [{"setting":"hospital","local_time":"2024-06-27T02:17","evidence":[{"item_id":"01J1CH7B50C6DC7W67T9AYTVX0","entry_id":"vs_1"}],"systolic_mmhg":125,"diastolic_mmhg":75,"pulse_bpm":84,"weight_kg":90.5}]

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01J1C2ZDA0TYTTM11347HN7791"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00738611"
effective: "2024-06-27T01:48:00Z"
recorded: "2024-06-27T05:34:00Z"
author:
  id: "urn:riverside-regional:staff:40217"
  name: "Marcus Hale, MD"
  role: "Emergency physician"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## ED provider note

**History.** The patient came to the emergency department on 6/26 with several days of diarrhea and feeling weak and run down. No chest pain, no fainting, and no trouble passing urine was reported. No known drug allergies. The home medication list (metformin, losartan, amlodipine and atorvastatin) has not yet been reconciled.

**Exam.** Vitals at 20:54: BP 135/81, HR 91, RR 20, T 98.7 F, SpO2 95%. The patient is awake, conversant and in no distress. Mucous membranes are somewhat dry. Heart rhythm is regular on auscultation, lungs are clear, and the abdomen is soft and non-tender.

**Results.** The <ref id="bmp">basic metabolic panel drawn at 21:03 shows sodium 129 (L), potassium 6.8 (HH), chloride 102, bicarbonate 18 (L), anion gap 9, urea nitrogen 59 (H), creatinine 1.90 (H), eGFR 28 (L) and glucose 146 (H)</ref>. The potassium is critically high and the renal function is clearly impaired.

**Assessment and plan**

1. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.8. Calcium gluconate 1 g IV was given from 21:28 to 21:38 to protect the heart. Continue to monitor closely and recheck labs.
2. <ref id="dx_aki">Acute kidney injury</ref>, creatinine 1.90 with urea nitrogen 59, in a patient with recent diarrhea and dry mucous membranes. Normal saline 1000 mL bolus started at 21:38, then 125 mL/h, and it is still running.
3. The sodium is low at 129 and the bicarbonate is 18; both will be followed on repeat labs while fluids run.
4. The hospitalist team has been called to admit the patient for further treatment.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6053459",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2024-06-27T01:48:00Z",
    "disposition": "admitted"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-06-27T01:54:00Z",
    "bp": { "systolic_mmhg": 135, "diastolic_mmhg": 81 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 20,
    "temp_f": 98.7,
    "spo2_pct": 95,
    "weight_kg": 90.5
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24178-6142",
    "collected": "2024-06-27T02:03:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "129",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.8",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "59",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.90",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
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
        "value": "146",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active"
  },
  "dx_hyperk": {
    "type": "diagnosis",
    "label": "Hyperkalemia",
    "icd10cm": "E87.5",
    "status": "active"
  },
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "1000 mL bolus, then 125 mL/h",
    "started": "2024-06-27T02:38:00Z"
  },
  "iv_calcium_gluconate": {
    "type": "inpatient_med",
    "drug_name": "calcium gluconate IV",
    "rxnorm_ingredient": "1908",
    "route": "IV",
    "dose_text": "1 g once",
    "started": "2024-06-27T02:28:00Z",
    "stopped": "2024-06-27T02:38:00Z"
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
    "status": "not_reconciled"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "not_reconciled"
  }
}
```
````
</details>

## Patient RRH-00605325, as of 2022-03-26: missing

- Narrative says (item 01FZ2K8620E9Y9KMN60SG8ATRM, ref `trop_2`): {"view":"labs","analyte":"troponin","value":0.01,"comparator":"<","date":"2022-03-27","ref":"trop_2"}
- Quote: "second troponin I <0.01"
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01FZ2K8620E9Y9KMN60SG8ATRM"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00605325"
effective: "2022-03-26T03:12:00Z"
recorded: "2022-03-26T07:50:00Z"
author:
  id: "urn:riverside-regional:staff:40217"
  name: "Marcus Hale, MD"
  role: "Emergency physician"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Emergency department provider note

**Chief complaint.** Chest pain.

**History.** The patient came in this evening with chest pain that began earlier in the day. By their account it was not brought on by exertion and there was no fainting. They were comfortable and in no distress when I saw them. Home medications are metformin 1000 mg twice daily with meals, lisinopril 10 mg daily, amlodipine 5 mg daily and rosuvastatin 20 mg nightly. Allergies: no known drug allergies.

**Exam.** Vitals at 22:18: BP 145/87, HR 83, RR 16, T 98.6 F, SpO2 95%. Well appearing, speaking in full sentences. Heart regular without murmur. Lungs clear. Chest wall nontender. No leg swelling.

**Results.** Troponin I <0.01 ng/mL on the 22:39 draw (<ref id="trop_1">first troponin I <0.01</ref>) and again <0.01 ng/mL on the repeat at 01:39 (<ref id="trop_2">second troponin I <0.01</ref>). ECG shows no ischemic changes. Basic metabolic panel from 22:39: sodium 137, potassium 4.5, chloride 105, bicarbonate 27, anion gap 5 (L), urea nitrogen 14, creatinine 1.27, eGFR 59 (L), glucose 150 (H).

**Assessment and plan**

1. Chest pain. <ref id="dx_acs">Acute coronary syndrome ruled out</ref>: two troponins <0.01 three hours apart and an ECG without ischemic changes. The metabolic panel shows no other acute abnormality that explains the pain; the mildly reduced eGFR of 59 and glucose of 150 are noted for the primary care physician.
2. The patient was reassured and given return precautions for recurrent or worsening chest pain, shortness of breath, or fainting. Follow up with the primary care physician within the next week.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6029791",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2022-03-26T03:12:00Z",
    "disposition": "home"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-03-26T03:18:00Z",
    "bp": { "systolic_mmhg": 145, "diastolic_mmhg": 87 },
    "heart_rate_bpm": 83,
    "resp_rate_per_min": 16,
    "temp_f": 98.6,
    "spo2_pct": 95,
    "weight_kg": 73.9
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L22084-6437",
    "collected": "2022-03-26T03:39:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.5", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "27",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "5",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "14", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.27",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "59",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "150",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "trop_1": {
    "type": "result",
    "test": { "local_code": "TROPI", "loinc": "10839-9", "name": "Troponin I" },
    "accession": "L22084-6997",
    "collected": "2022-03-26T03:39:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "<0.01",
    "unit": "ng/mL",
    "ref_range": "<0.04"
  },
  "trop_2": {
    "type": "result",
    "test": { "local_code": "TROPI", "loinc": "10839-9", "name": "Troponin I" },
    "accession": "L22085-7215",
    "collected": "2022-03-26T06:39:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "<0.01",
    "unit": "ng/mL",
    "ref_range": "<0.04"
  },
  "dx_acs": {
    "type": "diagnosis",
    "label": "Chest pain, acute coronary syndrome ruled out",
    "icd10cm": "I24.9",
    "status": "ruled_out"
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
    "status": "not_reconciled"
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

## Patient RRH-00605325, as of 2022-03-26: missing

- Narrative says (item 01FZ2K8620E9Y9KMN60SG8ATRM): {"view":"vitals","systolic_mmhg":145,"diastolic_mmhg":87,"ref":null}
- Quote: "BP 145/87"
- Your mapper: no matching row

## Patient RRH-00571362, as of 2024-04-12: missing

- Narrative says (item 01HV8SH3Q0KD0QRJY98X7FQ8EM, ref `trop_1`): {"view":"labs","analyte":"troponin","value":0.01,"comparator":"<","date":"2024-04-13","ref":"trop_1"}
- Quote: "troponin I <0.01 ng/mL, drawn 00:16"
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01HV8SH3Q0KD0QRJY98X7FQ8EM"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00571362"
effective: "2024-04-12T04:48:00Z"
recorded: "2024-04-12T09:17:00Z"
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

**History.** The patient came to the ED late this evening with chest pain. The pain was a pressure-like discomfort in the center of the chest that did not spread to the arm or jaw. There was no fainting and no cough or fever. They have no known drug allergies. Home medications on the list are metformin, lisinopril and rosuvastatin; they were not reconciled during this visit.

**Exam.** Vitals at 23:54: BP 152/91, HR 88, RR 21, T 99 F, SpO2 99%. The patient was comfortable and speaking in full sentences. Heart rhythm regular, lungs clear, chest wall without reproducible tenderness, legs without swelling. The ECG showed no ischemic changes.

**Results.** Basic metabolic panel on the 00:16 draw: sodium 140, potassium 4.0, chloride 99, bicarbonate 27, anion gap 14, urea nitrogen 22, creatinine 1.28 (H), eGFR 58 (L), glucose 160 (H). First <ref id="trop_1">troponin I <0.01 ng/mL, drawn 00:16</ref>. Repeat <ref id="trop_2">troponin I <0.01 ng/mL, drawn 03:16</ref>.

**Assessment and plan**

1. <ref id="dx_acs">Acute coronary syndrome ruled out</ref>: two troponins <0.01 three hours apart and an ECG without ischemic changes. The pain eased during the stay, and the patient looked well throughout.
2. Creatinine 1.28 with eGFR 58 on the 00:16 panel; the remainder of the chemistry panel is unremarkable apart from the mildly raised glucose of 160. Outpatient follow-up of these values with the primary care physician.
3. Blood pressure 152/91 at arrival, to be rechecked at the primary care visit.

Disposition: with serial troponins negative and the ECG reassuring, the patient is stable for discharge home with instructions to return for recurrent or worsening chest pain, shortness of breath or fainting, and to see their primary care physician within the next week.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6817772",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2024-04-12T04:48:00Z",
    "disposition": "home"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-04-12T04:54:00Z",
    "bp": { "systolic_mmhg": 152, "diastolic_mmhg": 91 },
    "heart_rate_bpm": 88,
    "resp_rate_per_min": 21,
    "temp_f": 99,
    "spo2_pct": 99,
    "weight_kg": 103.5
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24103-7248",
    "collected": "2024-04-12T05:16:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "140", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "27",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.28",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "58",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "160",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "trop_1": {
    "type": "result",
    "test": { "local_code": "TROPI", "loinc": "10839-9", "name": "Troponin I" },
    "accession": "L24103-4710",
    "collected": "2024-04-12T05:16:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "<0.01",
    "unit": "ng/mL",
    "ref_range": "<0.04"
  },
  "trop_2": {
    "type": "result",
    "test": { "local_code": "TROPI", "loinc": "10839-9", "name": "Troponin I" },
    "accession": "L24103-3678",
    "collected": "2024-04-12T08:16:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "<0.01",
    "unit": "ng/mL",
    "ref_range": "<0.04"
  },
  "dx_acs": {
    "type": "diagnosis",
    "label": "Chest pain, acute coronary syndrome ruled out",
    "icd10cm": "I24.9",
    "status": "ruled_out"
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
    "status": "not_reconciled"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "not_reconciled"
  },
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  }
}
```
````
</details>

## Patient RRH-00571362, as of 2024-04-12: missing

- Narrative says (item 01HV8SH3Q0KD0QRJY98X7FQ8EM, ref `trop_2`): {"view":"labs","analyte":"troponin","value":0.01,"comparator":"<","date":"2024-04-13","ref":"trop_2"}
- Quote: "troponin I <0.01 ng/mL, drawn 03:16"
- Your mapper: no matching row

## Patient RRH-00571362, as of 2024-04-12: missing

- Narrative says (item 01HV8SH3Q0KD0QRJY98X7FQ8EM): {"view":"vitals","systolic_mmhg":152,"diastolic_mmhg":91,"ref":null}
- Quote: "BP 152/91"
- Your mapper: no matching row

## Patient RRH-00605325, as of 2024-10-16: missing

- Narrative says (item 01JAC693Q01AJZEY7TW6HHJFZF, ref `dx_angioedema`): {"view":"problems","condition":"Angioedema, ACE inhibitor-associated","status":"active","ref":"dx_angioedema"}
- Quote: "Angioedema, ACE inhibitor-associated"
- Your mapper: no matching row

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

## Patient RRH-00905172, as of 2024-10-26: value

- Narrative says (item 01JB3N7W30VBSTD9ZSNC3Y51J7, ref `bmp`): {"view":"labs","analyte":"potassium","value":5,"date":"2024-10-26","ref":"bmp"}
- Quote: "potassium 5.0"
- Your mapper: [{"analyte":"potassium","value":3.9,"unit":"mmol/L","collected":"2024-10-26T11:09:00Z","status":"final","evidence":[{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"bmp"}],"loinc":"2823-3"}]

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JB3N7W30VBSTD9ZSNC3Y51J7"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00905172"
effective: "2024-10-26T01:05:00Z"
recorded: "2024-10-26T05:37:00Z"
author:
  id: "urn:riverside-regional:staff:40217"
  name: "Marcus Hale, MD"
  role: "Emergency physician"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## ED provider note

**History.** The patient presented this evening feeling unwell, with nausea, malaise and fast breathing. He takes dapagliflozin for diabetes, along with metformin, glipizide, lisinopril and amlodipine. He has no known drug allergies.

**Exam.** Vitals at 20:11: BP 116/70, HR 100, RR 19, T 99.2 F, SpO2 97%. He appears tired and mildly dehydrated, with dry mucous membranes. Breathing is somewhat deep but unlabored. Lungs are clear and the heart rhythm is regular. The abdomen is soft.

**Results.** The <ref id="bmp">basic metabolic panel drawn at 20:23 shows sodium 132, potassium 5.0, chloride 92, bicarbonate 13, anion gap 27, urea nitrogen 35, creatinine 0.93, eGFR 63 and glucose 165</ref>. The venous blood gas drawn at 20:23 shows pH 7.10 with pCO2 28. Beta-hydroxybutyrate is 5.6 mmol/L. The glucose is only mildly elevated despite a wide-gap metabolic acidosis with marked ketosis.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. The acidosis, anion gap and ketones with a near-normal glucose fit this picture. <ref id="med_dapagliflozin">Dapagliflozin is held.</ref> Insulin infusion per DKA protocol at 0.1 units/kg/h is to be started, and the hospitalist team will admit him.
2. Metformin and lisinopril are held for now. Glipizide and amlodipine are listed to continue.
3. Potassium is 5.0 and will be rechecked with repeat chemistries as the insulin takes effect.

He was told why he is being admitted and agrees with the plan.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6697396",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2024-10-26T01:05:00Z",
    "disposition": "admitted"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-10-26T01:11:00Z",
    "bp": { "systolic_mmhg": 116, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 100,
    "resp_rate_per_min": 19,
    "temp_f": 99.2,
    "spo2_pct": 97,
    "weight_kg": 81.5
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24299-5577",
    "collected": "2024-10-26T01:23:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "92",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "13",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "27",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "35",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.93",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "63",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "165",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "vbg": {
    "type": "panel",
    "panel": { "local_code": "VBG", "name": "Venous blood gas" },
    "accession": "L24299-8857",
    "collected": "2024-10-26T01:23:00Z",
    "specimen": "venous blood",
    "status": "final",
    "components": [
      { "test": { "local_code": "VPH", "loinc": "2746-6", "name": "pH, venous" }, "value": "7.10", "ref_range": "7.32-7.43", "flag": "LL" },
      {
        "test": { "local_code": "VPCO2", "loinc": "2021-4", "name": "pCO2, venous" },
        "value": "28",
        "unit": "mmHg",
        "ref_range": "41-51",
        "flag": "L"
      }
    ]
  },
  "bhb": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L24299-6004",
    "collected": "2024-10-26T01:23:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "5.6",
    "unit": "mmol/L",
    "ref_range": "<0.4",
    "flag": "HH"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active"
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2024-10-26T02:15:00Z"
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

## Patient RRH-00905172, as of 2024-10-26: value

- Narrative says (item 01JB3N7W30VBSTD9ZSNC3Y51J7, ref `bmp`): {"view":"labs","analyte":"chloride","value":92,"date":"2024-10-26","ref":"bmp"}
- Quote: "chloride 92"
- Your mapper: [{"analyte":"chloride","value":104,"unit":"mmol/L","collected":"2024-10-26T11:09:00Z","status":"final","evidence":[{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"bmp"}],"loinc":"2075-0"}]

## Patient RRH-00905172, as of 2024-10-26: value

- Narrative says (item 01JB3N7W30VBSTD9ZSNC3Y51J7, ref `bmp`): {"view":"labs","analyte":"bicarbonate","value":13,"date":"2024-10-26","ref":"bmp"}
- Quote: "bicarbonate 13"
- Your mapper: [{"analyte":"bicarbonate","value":19,"unit":"mmol/L","collected":"2024-10-26T11:09:00Z","status":"final","evidence":[{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"bmp"}],"loinc":"2028-9"}]

## Patient RRH-00905172, as of 2024-10-26: value

- Narrative says (item 01JB3N7W30VBSTD9ZSNC3Y51J7, ref `bmp`): {"view":"labs","analyte":"anion_gap","value":27,"date":"2024-10-26","ref":"bmp"}
- Quote: "anion gap 27"
- Your mapper: [{"analyte":"anion_gap","value":9,"unit":"mmol/L","collected":"2024-10-26T11:09:00Z","status":"final","evidence":[{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"bmp"}],"loinc":"33037-3"}]

## Patient RRH-00905172, as of 2024-10-26: value

- Narrative says (item 01JB3N7W30VBSTD9ZSNC3Y51J7, ref `bmp`): {"view":"labs","analyte":"bun","value":35,"date":"2024-10-26","ref":"bmp"}
- Quote: "urea nitrogen 35"
- Your mapper: [{"analyte":"bun","value":22,"unit":"mg/dL","collected":"2024-10-26T11:09:00Z","status":"final","evidence":[{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"bmp"}],"loinc":"3094-0"}]

## Patient RRH-00905172, as of 2024-10-26: value

- Narrative says (item 01JB3N7W30VBSTD9ZSNC3Y51J7, ref `bmp`): {"view":"labs","analyte":"creatinine","value":0.93,"date":"2024-10-26","ref":"bmp"}
- Quote: "creatinine 0.93"
- Your mapper: [{"analyte":"creatinine","value":0.83,"unit":"mg/dL","collected":"2024-10-26T11:09:00Z","status":"final","evidence":[{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"bmp"}],"loinc":"2160-0"}]

## Patient RRH-00905172, as of 2024-10-26: value

- Narrative says (item 01JB3N7W30VBSTD9ZSNC3Y51J7, ref `bmp`): {"view":"labs","analyte":"egfr","value":63,"date":"2024-10-26","ref":"bmp"}
- Quote: "eGFR 63"
- Your mapper: [{"analyte":"egfr","value":72,"unit":"mL/min/1.73m2","collected":"2024-10-26T11:09:00Z","status":"final","evidence":[{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"bmp"}],"egfr_equation":"ckd-epi-2021","loinc":"98979-8"}]

## Patient RRH-00905172, as of 2024-10-26: value

- Narrative says (item 01JB3N7W30VBSTD9ZSNC3Y51J7): {"view":"vitals","systolic_mmhg":116,"diastolic_mmhg":70,"ref":null}
- Quote: "BP 116/70"
- Your mapper: [{"setting":"hospital","local_time":"2024-10-26T00:00","evidence":[{"item_id":"01JB3V84E05M8V4MRJD29Q4E1M","entry_id":"vs_1"}],"systolic_mmhg":130,"diastolic_mmhg":78,"pulse_bpm":103,"weight_kg":81.5},{"setting":"hospital","local_time":"2024-10-26T07:16","evidence":[{"item_id":"01JB4HSJC067DHTGC4YKE0WV02","entry_id":"vs_1"}],"systolic_mmhg":126,"diastolic_mmhg":76,"pulse_bpm":105,"weight_kg":81.5}]
