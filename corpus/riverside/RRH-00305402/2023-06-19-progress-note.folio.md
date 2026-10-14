---
folio: "0.1"
id: "01H39YDMV0C5AAM3E4HFDRKRFB"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00305402"
effective: "2023-06-19T12:48:00Z"
recorded: "2023-06-19T13:45:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval.** Overnight course was uneventful. The patient feels much better this morning, with less thirst and no further diarrhea reported. Saline has continued at 125 mL/h since 18:24 yesterday. No known drug allergies (NKDA).

**Exam.** Vitals at 07:28: BP 132/79, HR 91, RR 24, T 98.2 F, SpO2 99%. Alert and comfortable. Mucous membranes moist. Lungs clear, abdomen soft.

**Results.** <ref id="bmp">On the 06:06 panel sodium is 138, potassium 5.6, chloride 103, bicarbonate 26, anion gap 9, urea nitrogen 31, creatinine 1.39 with eGFR 46, and glucose 141.</ref> Sodium has normalized and potassium has fallen from 6.3 yesterday but is still mildly high.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, improving: creatinine down from 1.89 to 1.39 with fluids. Continue saline for now and repeat the BMP this afternoon.
2. Hyperkalemia, improved but not yet normal at 5.6. Recheck with the next panel.
3. Losartan and metformin remain held.
4. Atorvastatin continues.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6441424",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-06-18T22:34:00Z",
    "admitted": "2023-06-19T04:11:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-06-19T12:28:00Z",
    "bp": { "systolic_mmhg": 132, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 24,
    "temp_f": 98.2,
    "spo2_pct": 99,
    "weight_kg": 70.1
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23170-5527",
    "collected": "2023-06-19T11:06:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.6",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "31",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.39",
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
        "value": "141",
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
    "dose_text": "1000 mL bolus, then 125 mL/h",
    "started": "2023-06-18T23:24:00Z"
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
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
