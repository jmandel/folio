---
folio: "0.1"
id: "01HZTWE930PSM6WBWNVPJ9AWST"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00696404"
effective: "2024-06-08T00:27:00Z"
recorded: "2024-06-08T02:57:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient was sent up from the ED with abnormal labs after several days of loose stools. They have felt weak and thirsty, with little appetite, and have kept up with their usual home medicines throughout. <ref id="precipitant">The AKI is attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> No known drug allergies.

**Home medications.** Atorvastatin 40 mg nightly, to be continued.

**Exam.** Vitals at 19:17: BP 131/79, HR 105, RR 16, T 98.1 F, SpO2 96%. Mildly tachycardic. The patient looks somewhat dry. No respiratory distress.

**Results.** The basic metabolic panel drawn at 15:52 showed sodium 133, potassium 6.3, chloride 100, bicarbonate 16, anion gap 17, urea nitrogen 59, creatinine 2.08 (eGFR 30) and glucose 129. Normal saline was started in the ED at 16:10, a 1000 mL bolus followed by 125 mL/h, and it is still running.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, prerenal from volume loss. Continue normal saline at 125 mL/h, watch urine output, and repeat the BMP in the morning. Avoid nephrotoxins.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.3 on arrival and treated in the ED. Recheck the potassium with the morning labs and keep the patient on telemetry.
3. Mild anion gap acidosis with bicarbonate 16, expected to improve with fluids and recovering kidney function.
4. Hyperlipidemia: continue atorvastatin 40 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6388766",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-06-07T20:20:00Z",
    "admitted": "2024-06-07T23:28:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-06-08T00:17:00Z",
    "bp": { "systolic_mmhg": 131, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 105,
    "resp_rate_per_min": 16,
    "temp_f": 98.1,
    "spo2_pct": 96,
    "weight_kg": 86.2
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
    "accession": "L24159-5430",
    "collected": "2024-06-07T20:52:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "16",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "17",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "59",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.08",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "30",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "129",
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
    "started": "2024-06-07T21:10:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
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
