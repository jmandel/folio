---
folio: "0.1"
id: "01H0QJASC0SSXXF1M6E3RJEFT7"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00799084"
effective: "2023-05-18T12:57:00Z"
recorded: "2023-05-18T13:56:00Z"
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

**Interval events.** Overnight she rested reasonably well. Cough persists but is less harsh, and she is taking food and fluids. Normal saline at 75 mL/h continues.

**Exam.** Vitals at 07:37: BP 117/70, HR 111, RR 24, temperature 98.7 F, SpO2 98%. The heart rate and respiratory rate are higher than yesterday, although she looks comfortable and speaks in full sentences. Crackles persist at the right base.

**Results.** <ref id="bmp">Basic metabolic panel at 06:10: sodium 134, potassium 3.9, chloride 104, bicarbonate 24, anion gap 6, urea nitrogen 29, creatinine 1.39, eGFR 49, glucose 154.</ref>

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, active. Continue treatment. The faster pulse and breathing will be watched closely today, with repeat vitals this afternoon.
2. Kidney function and sodium are improving with fluids. Continue IV fluids and recheck the panel in the morning.
3. Losartan, metformin and dapagliflozin remain held. Hydrochlorothiazide and amlodipine continue.
4. Allergy: lisinopril (cough).

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6143345",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-05-17T19:12:00Z",
    "admitted": "2023-05-17T22:25:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-05-18T12:37:00Z",
    "bp": { "systolic_mmhg": 117, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 111,
    "resp_rate_per_min": 24,
    "temp_f": 98.7,
    "spo2_pct": 98,
    "weight_kg": 74.4
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
    "accession": "L23138-4204",
    "collected": "2023-05-18T11:10:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "6",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "29",
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
        "value": "49",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "154",
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
    "started": "2023-05-17T20:02:00Z"
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
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
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
  }
}
```
