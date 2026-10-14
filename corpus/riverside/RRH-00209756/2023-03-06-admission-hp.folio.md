---
folio: "0.1"
id: "01GTX8FBZ0K3NMK938KWZRR3V4"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00209756"
effective: "2023-03-07T03:05:00Z"
recorded: "2023-03-07T05:25:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient is seen in the evening after evaluation in the ED this afternoon. They had been taking an over-the-counter anti-inflammatory for back pain for several days and drinking little. They arrived feeling generally unwell and were found to have abnormal kidney function and a high potassium on the 16:58 panel. They have no known drug allergies. They received calcium gluconate and a saline bolus in the ED, and saline continues at 125 mL/h, started 17:24.

**Home medications.** Losartan 50 mg daily, metformin 1000 mg twice daily with meals, glipizide 5 mg daily, atorvastatin 40 mg nightly.

**Exam.** Vitals at 20:55: BP 106/64, HR 89, RR 17, T 98.2 F, SpO2 96%. Comfortable at rest, no distress. Mucous membranes slightly dry. Lungs clear, heart regular, abdomen soft.

**Results.** BMP at 16:58: sodium 137, potassium 6.7, chloride 106, bicarbonate 17, anion gap 14, urea nitrogen 52, creatinine 2.57, eGFR 22, glucose 125.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, <ref id="precipitant">most likely from several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake</ref>. Continue isotonic saline, trend creatinine each morning, avoid nephrotoxins.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.7 on arrival, treated in the ED. Repeat potassium in the morning and keep on telemetry.
3. Medications: <ref id="med_losartan">hold losartan until creatinine is back to baseline</ref>. <ref id="med_metformin">Hold metformin during the acute illness</ref>, to resume when able. Continue glipizide and atorvastatin.
4. Back pain: no naproxen or other anti-inflammatory drugs while in hospital.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6739258",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-03-06T22:34:00Z",
    "admitted": "2023-03-07T02:01:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-03-07T02:55:00Z",
    "bp": { "systolic_mmhg": 106, "diastolic_mmhg": 64 },
    "heart_rate_bpm": 89,
    "resp_rate_per_min": 17,
    "temp_f": 98.2,
    "spo2_pct": 96,
    "weight_kg": 81.7
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "dx_hyperk": {
    "type": "diagnosis",
    "label": "Hyperkalemia",
    "icd10cm": "E87.5",
    "status": "active",
    "rank": "secondary"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23065-4483",
    "collected": "2023-03-06T22:58:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.7",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "106", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "17",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "52",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.57",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "22",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "125",
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
    "started": "2023-03-06T23:24:00Z"
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
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold until creatinine back to baseline"
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
