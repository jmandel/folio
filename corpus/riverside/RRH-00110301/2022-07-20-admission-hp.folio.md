---
folio: "0.1"
id: "01G8F535Y0K4E5S5EE81AWX9TR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00110301"
effective: "2022-07-20T23:21:00Z"
recorded: "2022-07-21T01:14:00Z"
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

**Reason for admission:** <ref id="dx_pneumonia">community-acquired pneumonia</ref>.

**History of present illness.** The patient was seen in the emergency department this afternoon with several days of cough and feeling unwell, and was found to have pneumonia on evaluation. They were breathing comfortably at rest but were a little short of breath with exertion. Intravenous fluids were started in the ED at 14:55 and are still running at 75 mL/h. I am admitting them to the hospital medicine service for treatment and monitoring.

**Allergies:** no known drug allergies.

**Exam.** Vitals at 18:11: BP 124/74, HR 96, RR 18, temperature 98.3 F, SpO2 94%. The patient is alert, conversant and in no distress. Breath sounds are diminished with crackles at the base on the affected side. Heart rhythm is regular. Abdomen is soft and nontender. No leg swelling.

**Results.** Basic metabolic panel drawn at 14:29: sodium 135 (low), potassium 4.8, chloride 105, bicarbonate 19 (low), anion gap 11, urea nitrogen 49 (high), creatinine 1.42 (high), eGFR 44 (low), glucose 202 (high).

**Assessment and plan**

1. Community-acquired pneumonia: the patient is stable on current oxygen saturation of 94%. Continue treatment as started in the ED, monitor respiratory rate and saturation through the night, and encourage fluids and coughing.
2. Elevated urea nitrogen and creatinine with a low bicarbonate: probably volume depletion in the setting of acute illness. Continue the saline infusion at 75 mL/h and repeat the basic metabolic panel in the morning.
3. Glucose 202 on the afternoon panel: recheck with the morning labs.
4. Medication reconciliation of the home medication list is pending and will be completed tomorrow.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6941198",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-07-20T19:05:00Z",
    "admitted": "2022-07-20T22:32:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-07-20T23:11:00Z",
    "bp": { "systolic_mmhg": 124, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 96,
    "resp_rate_per_min": 18,
    "temp_f": 98.3,
    "spo2_pct": 94,
    "weight_kg": 88
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
    "accession": "L22201-7598",
    "collected": "2022-07-20T19:29:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.8", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "49",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.42",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "44",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "202",
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
    "started": "2022-07-20T19:55:00Z"
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
  }
}
```
