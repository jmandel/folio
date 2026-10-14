# Feedback from an independent prose check

A separate reader looked only at the narrative text (with its ref spans) of some items from other patients of this
source, wrote down the facts each narrative asserts, and compared them with what your mapper returned for that patient
as of the item's date. 28 discrepancies are listed below, each with the item it came from (full Markdown).
The reader can be wrong (narratives mention plans, other organizations' decisions, or round numbers); the schema is
the authority. For each one, decide whether your mapper misreads the data and fix the mapper where it does.

## Patient RRH-00388366, as of 2025-06-24: missing

- Narrative says (item 01JYJ5CY90HWSVZC5HYP60F3RB): {"view":"labs","analyte":"ph","value":7.08,"date":"2025-06-24","ref":null}
- Quote: "Venous blood gas at 16:17: pH 7.08"
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JYJ5CY90HWSVZC5HYP60F3RB"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00388366"
effective: "2025-06-24T20:55:00Z"
recorded: "2025-06-24T23:47:00Z"
author:
  id: "urn:riverside-regional:staff:40388"
  name: "Adaeze Okonjo, MD"
  role: "Emergency physician"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## ED provider note

**Chief complaint.** Feeling unwell with fast breathing.

**History.** The patient is a middle-aged adult with type 2 diabetes who came to the ED feeling weak, nauseated and short of breath. Her home medicines include <ref id="med_dapagliflozin">dapagliflozin 10 mg daily</ref>, along with metformin 1000 mg twice daily, lisinopril 20 mg daily and hydrochlorothiazide 25 mg daily; none of these have been reconciled yet. She has no known drug allergies.

**Exam.** Vitals at 16:01: BP 100/60, HR 104, RR 22, T 99.2 F, SpO2 97%. She is tachypneic with deep, regular respirations and appears dry. Abdomen is soft.

**Results.** The <ref id="bmp">basic metabolic panel drawn at 16:17 showed sodium 134 mmol/L (L), potassium 5.3 mmol/L (H), chloride 94 mmol/L (L), bicarbonate 8 mmol/L (LL), anion gap 32 mmol/L (H), urea nitrogen 35 mg/dL (H), creatinine 1.57 mg/dL (H), eGFR 50 mL/min/1.73m2 (L) and glucose 242 mg/dL (H)</ref>. Venous blood gas at 16:17: pH 7.08, pCO2 27 mmHg. Beta-hydroxybutyrate 6.6 mmol/L.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic diabetic ketoacidosis</ref>: severe acidosis with a wide anion gap and markedly elevated ketones despite a glucose of only 242. The insulin infusion per DKA protocol at 0.1 units/kg/h was started at 17:05 and is running.
2. Mild hyperkalemia and acute kidney injury are likely from volume depletion; recheck with the next panel.
3. Admit to the hospitalist service for continued DKA management.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6437094",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2025-06-24T20:55:00Z",
    "disposition": "admitted"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-06-24T21:01:00Z",
    "bp": { "systolic_mmhg": 100, "diastolic_mmhg": 60 },
    "heart_rate_bpm": 104,
    "resp_rate_per_min": 22,
    "temp_f": 99.2,
    "spo2_pct": 97,
    "weight_kg": 79.1
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25175-8693",
    "collected": "2025-06-24T21:17:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "94",
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
        "value": "35",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.57",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "50",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "242",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "vbg": {
    "type": "panel",
    "panel": { "local_code": "VBG", "name": "Venous blood gas" },
    "accession": "L25175-9881",
    "collected": "2025-06-24T21:17:00Z",
    "specimen": "venous blood",
    "status": "final",
    "components": [
      { "test": { "local_code": "VPH", "loinc": "2746-6", "name": "pH, venous" }, "value": "7.08", "ref_range": "7.32-7.43", "flag": "LL" },
      {
        "test": { "local_code": "VPCO2", "loinc": "2021-4", "name": "pCO2, venous" },
        "value": "27",
        "unit": "mmHg",
        "ref_range": "41-51",
        "flag": "L"
      }
    ]
  },
  "bhb": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L25175-9054",
    "collected": "2025-06-24T21:17:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.6",
    "unit": "mmol/L",
    "ref_range": "<0.4",
    "flag": "HH"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Diabetic ketoacidosis, euglycemic",
    "icd10cm": "E11.10",
    "status": "active"
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2025-06-24T22:05:00Z"
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
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  }
}
```
````
</details>

## Patient RRH-00388366, as of 2025-06-24: missing

- Narrative says (item 01JYJ5CY90HWSVZC5HYP60F3RB): {"view":"labs","analyte":"pco2","value":27,"date":"2025-06-24","ref":null}
- Quote: "pCO2 27 mmHg"
- Your mapper: no matching row

## Patient RRH-00571362, as of 2024-04-12: missing

- Narrative says (item 01HV8SH3Q0KD0QRJY98X7FQ8EM): {"view":"vitals","systolic_mmhg":152,"diastolic_mmhg":91,"ref":null}
- Quote: "BP 152/91"
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

## Patient RRH-00941538, as of 2025-09-23: value

- Narrative says (item 01K5TRMH905J6T79GAWK9J6PJ0): {"view":"vitals","systolic_mmhg":111,"diastolic_mmhg":67,"ref":null}
- Quote: "BP 111/67"
- Your mapper: [{"setting":"hospital","local_time":"2025-09-23T05:27","evidence":[{"item_id":"01K5V7SRM0KW9CVF07PWJD9N8B","entry_id":"vs_1"}],"systolic_mmhg":112,"diastolic_mmhg":67,"pulse_bpm":112,"weight_kg":120.2}]

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01K5TRMH905J6T79GAWK9J6PJ0"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00941538"
effective: "2025-09-23T04:41:00Z"
recorded: "2025-09-23T07:47:00Z"
author:
  id: "urn:riverside-regional:staff:40388"
  name: "Adaeze Okonjo, MD"
  role: "Emergency physician"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Emergency department provider note

**History.** The patient presented tonight feeling unwell, with nausea, abdominal discomfort and rapid breathing. The history was taken in the ED and the home medication list is still being reconciled. The allergy list reads NKDA. Home medications on the list include <ref id="med_empagliflozin">empagliflozin 10 mg daily</ref>, metformin 1000 mg twice daily with meals, lisinopril 40 mg daily, hydrochlorothiazide 25 mg daily, amlodipine 5 mg daily and atorvastatin 20 mg nightly.

**Exam.** Vitals at 23:47: BP 111/67, HR 103, RR 22, T 99.1 F, SpO2 99%. He appeared dry and was breathing deeply and quickly. The abdomen was soft.

**Results.** The <ref id="bmp">basic metabolic panel drawn at 00:03 showed sodium 134, potassium 5.4, chloride 93, bicarbonate 14, anion gap 27, urea nitrogen 30, creatinine 1.76, eGFR 39 and glucose 175</ref>. The venous blood gas at 00:03 showed pH 7.19 and pCO2 24. Beta-hydroxybutyrate was 5.1 mmol/L.

**Assessment and plan**

1. <ref id="dx_dka">Diabetic ketoacidosis, euglycemic</ref>: a wide anion gap acidosis with ketones markedly elevated while the glucose is only modestly high. An insulin infusion per DKA protocol at 0.1 units/kg/h was started at 00:51 and is running.
2. Kidney function is worse than normal, with creatinine 1.76 and eGFR 39, and potassium is mildly high at 5.4. These will be rechecked as treatment proceeds.
3. The patient will be admitted to the hospitalist service for continued care.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6494639",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2025-09-23T04:41:00Z",
    "disposition": "admitted"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-09-23T04:47:00Z",
    "bp": { "systolic_mmhg": 111, "diastolic_mmhg": 67 },
    "heart_rate_bpm": 103,
    "resp_rate_per_min": 22,
    "temp_f": 99.1,
    "spo2_pct": 99,
    "weight_kg": 120.2
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25266-4520",
    "collected": "2025-09-23T05:03:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.4",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "93",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "14",
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
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.76",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "39",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "175",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "vbg": {
    "type": "panel",
    "panel": { "local_code": "VBG", "name": "Venous blood gas" },
    "accession": "L25266-9407",
    "collected": "2025-09-23T05:03:00Z",
    "specimen": "venous blood",
    "status": "final",
    "components": [
      { "test": { "local_code": "VPH", "loinc": "2746-6", "name": "pH, venous" }, "value": "7.19", "ref_range": "7.32-7.43", "flag": "LL" },
      {
        "test": { "local_code": "VPCO2", "loinc": "2021-4", "name": "pCO2, venous" },
        "value": "24",
        "unit": "mmHg",
        "ref_range": "41-51",
        "flag": "L"
      }
    ]
  },
  "bhb": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L25266-5894",
    "collected": "2025-09-23T05:03:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "5.1",
    "unit": "mmol/L",
    "ref_range": "<0.4",
    "flag": "HH"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Diabetic ketoacidosis, euglycemic",
    "icd10cm": "E11.10",
    "status": "active"
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2025-09-23T05:51:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
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

## Patient RRH-00941538, as of 2025-09-23: missing

- Narrative says (item 01K5TRMH905J6T79GAWK9J6PJ0): {"view":"labs","analyte":"ph","value":7.19,"ref":null}
- Quote: "pH 7.19"
- Your mapper: no matching row

## Patient RRH-00941538, as of 2025-09-23: missing

- Narrative says (item 01K5TRMH905J6T79GAWK9J6PJ0): {"view":"labs","analyte":"pco2","value":24,"ref":null}
- Quote: "pCO2 24"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"sodium","value":133,"ref":null}
- Quote: "sodium 133 (L)"
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JPCGCHE0HSS3TGGCM7T94RHP"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00903997"
effective: "2025-03-15T07:12:00Z"
recorded: "2025-03-15T08:58:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** community-acquired pneumonia.

**History of present illness.** The patient came to the ED last evening with several days of cough, fevers at home, tiredness and chest discomfort on deep breaths. She was started on antibiotics in the department and transferred to the floor overnight. Allergy list: no known drug allergies.

**Home medications.** Losartan 50 mg daily, hydrochlorothiazide 25 mg daily and atorvastatin 20 mg nightly. Metformin 1000 mg twice daily with meals is also on her list.

**Exam.** Vitals at 02:02: BP 114/68, HR 99, RR 22, T 98.1 F, SpO2 99%. Looks tired but is conversational. Crackles at the lung base with a few scattered wheezes. Heart regular, abdomen soft, no leg swelling.

**Results.** The 22:42 panel showed sodium 133 (L), potassium 4.9, chloride 105, bicarbonate 20 (L), anion gap 8, urea nitrogen 33 (H), creatinine 0.91, eGFR 72 and glucose 136 (H). Normal saline has been running at 75 mL/h since 23:02.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Continue the antibiotic started in the ED, monitor oxygen saturation and respiratory rate, and encourage fluids and coughing. Continue IV saline for now given the low sodium and elevated urea nitrogen; repeat the metabolic panel in the morning.
2. <ref id="med_metformin">Metformin is held during the acute illness</ref>, to be resumed when she is able.
3. Continue losartan, hydrochlorothiazide and atorvastatin at the home doses.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6895131",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-03-15T03:12:00Z",
    "admitted": "2025-03-15T06:13:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-03-15T07:02:00Z",
    "bp": { "systolic_mmhg": 114, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 22,
    "temp_f": 98.1,
    "spo2_pct": 99,
    "weight_kg": 103.9
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
    "accession": "L25073-4954",
    "collected": "2025-03-15T03:42:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "33",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.91",
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
        "value": "136",
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
    "started": "2025-03-15T04:02:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
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
  }
}
```
````
</details>

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"potassium","value":4.9,"ref":null}
- Quote: "potassium 4.9"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"chloride","value":105,"ref":null}
- Quote: "chloride 105"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"bicarbonate","value":20,"ref":null}
- Quote: "bicarbonate 20 (L)"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"anion_gap","value":8,"ref":null}
- Quote: "anion gap 8"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"bun","value":33,"ref":null}
- Quote: "urea nitrogen 33 (H)"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"creatinine","value":0.91,"ref":null}
- Quote: "creatinine 0.91"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"egfr","value":72,"ref":null}
- Quote: "eGFR 72"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPCGCHE0HSS3TGGCM7T94RHP): {"view":"labs","analyte":"glucose","value":136,"ref":null}
- Quote: "glucose 136 (H)"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: value

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"vitals","systolic_mmhg":123,"diastolic_mmhg":74,"ref":null}
- Quote: "BP 123/74"
- Your mapper: [{"setting":"hospital","local_time":"2025-03-15T02:02","evidence":[{"item_id":"01JPCGCHE0HSS3TGGCM7T94RHP","entry_id":"vs_1"}],"systolic_mmhg":114,"diastolic_mmhg":68,"pulse_bpm":99,"weight_kg":103.9}]

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JPC7P7609KSPR9H7014WARSW"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00903997"
effective: "2025-03-15T03:12:00Z"
recorded: "2025-03-15T06:26:00Z"
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

**History.** The patient presented this evening with several days of cough, feeling feverish and tired, and discomfort in the chest with deep breaths. There has been no vomiting. Allergy list: no known drug allergies.

**Exam.** Vitals at 22:18: BP 123/74, HR 96, RR 18, T 98.4 F, SpO2 96%. Comfortable at rest, speaking in full sentences. Lung exam shows reduced air entry with crackles at the base on the side of the cough. Heart rhythm regular. Abdomen soft and non-tender.

**Results.** <ref id="cbc">The CBC drawn at 22:42 shows white blood cells 16.7 (H), hemoglobin 12.9 and platelets 286.</ref> The basic metabolic panel from 22:42 shows sodium 133 (L), potassium 4.9, chloride 105, bicarbonate 20 (L), anion gap 8, urea nitrogen 33 (H), creatinine 0.91 with eGFR 72, and glucose 136 (H).

**Treatment in the department.** Normal saline was started at 75 mL/h at 23:02 and is still running. Ceftriaxone 1 g IV every 24 h was started at 23:42 and is still running.

**Home medications.** Her home list is metformin 1000 mg twice daily with meals, losartan 50 mg daily, hydrochlorothiazide 25 mg daily and atorvastatin 20 mg nightly. None of these has been reconciled yet in the department; that will be done by the admitting team.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, with a raised white count and a clinical picture of lower respiratory infection. She is not hypoxic on room air. Continue ceftriaxone and IV fluids as started.
2. The sodium, bicarbonate and urea nitrogen above will be rechecked by the inpatient team.

She will be admitted to the hospitalist service for further treatment. The patient understands and agrees with the plan.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6895131",
    "document_kind": "ed_note",
    "class": "emergency",
    "service": "Emergency Medicine",
    "arrived": "2025-03-15T03:12:00Z",
    "disposition": "admitted"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-03-15T03:18:00Z",
    "bp": { "systolic_mmhg": 123, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 96,
    "resp_rate_per_min": 18,
    "temp_f": 98.4,
    "spo2_pct": 96,
    "weight_kg": 103.9
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25073-4954",
    "collected": "2025-03-15T03:42:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "33",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.91",
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
        "value": "136",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "cbc": {
    "type": "panel",
    "panel": { "local_code": "CBC", "loinc": "58410-2", "name": "Complete blood count" },
    "accession": "L25073-9399",
    "collected": "2025-03-15T03:42:00Z",
    "specimen": "whole blood",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "WBC", "loinc": "6690-2", "name": "White blood cells" },
        "value": "16.7",
        "unit": "10*3/uL",
        "ref_range": "4.0-10.5",
        "flag": "H"
      },
      { "test": { "local_code": "HGB", "loinc": "718-7", "name": "Hemoglobin" }, "value": "12.9", "unit": "g/dL", "ref_range": "11.5-15.5" },
      { "test": { "local_code": "PLT", "loinc": "777-3", "name": "Platelets" }, "value": "286", "unit": "10*3/uL", "ref_range": "150-400" }
    ]
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "active"
  },
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "75 mL/h",
    "started": "2025-03-15T04:02:00Z"
  },
  "iv_ceftriaxone": {
    "type": "inpatient_med",
    "drug_name": "ceftriaxone IV",
    "rxnorm_ingredient": "2193",
    "route": "IV",
    "dose_text": "1 g every 24 h",
    "started": "2025-03-15T04:42:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
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

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW, ref `cbc`): {"view":"labs","analyte":"wbc","value":16.7,"ref":"cbc"}
- Quote: "white blood cells 16.7 (H)"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW, ref `cbc`): {"view":"labs","analyte":"hemoglobin","value":12.9,"ref":"cbc"}
- Quote: "hemoglobin 12.9"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW, ref `cbc`): {"view":"labs","analyte":"platelets","value":286,"ref":"cbc"}
- Quote: "platelets 286"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"sodium","value":133,"ref":null}
- Quote: "sodium 133 (L)"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"potassium","value":4.9,"ref":null}
- Quote: "potassium 4.9"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"chloride","value":105,"ref":null}
- Quote: "chloride 105"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"bicarbonate","value":20,"ref":null}
- Quote: "bicarbonate 20 (L)"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"anion_gap","value":8,"ref":null}
- Quote: "anion gap 8"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"bun","value":33,"ref":null}
- Quote: "urea nitrogen 33 (H)"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"creatinine","value":0.91,"ref":null}
- Quote: "creatinine 0.91"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"egfr","value":72,"ref":null}
- Quote: "eGFR 72"
- Your mapper: no matching row

## Patient RRH-00903997, as of 2025-03-15: missing

- Narrative says (item 01JPC7P7609KSPR9H7014WARSW): {"view":"labs","analyte":"glucose","value":136,"ref":null}
- Quote: "glucose 136 (H)"
- Your mapper: no matching row
