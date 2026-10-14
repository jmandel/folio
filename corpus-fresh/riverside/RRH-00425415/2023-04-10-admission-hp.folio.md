---
folio: "0.1"
id: "01GXN9YNM0PACVW1K62BJ3CTPK"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00425415"
effective: "2023-04-10T07:41:00Z"
recorded: "2023-04-10T10:04:00Z"
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

**Reason for admission:** kidney injury with high potassium.

**History of present illness.** The patient came in last evening after four days of diarrhea with poor oral intake, feeling weak and lightheaded on standing. There has been no vomiting and no fever at home. Throughout the illness the patient kept taking the usual blood pressure pills. In the ED the potassium was 6.1 and creatinine 2.55 on the 21:24 panel, with urea nitrogen 57, bicarbonate 20 and anion gap 19. Calcium gluconate was given and saline started at 21:45.

**Medications and allergies.** Home rosuvastatin 20 mg nightly. Allergies: NKDA.

**Exam.** BP 122/73, HR 80, RR 24, T 99.2 F, SpO2 98% at 02:31. The patient is comfortable and a little dry-mouthed. Heart rate is regular. Lungs are clear. Abdomen is soft without tenderness.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, creatinine 2.55 with eGFR 32. <ref id="precipitant">Attributed to volume depletion from four days of diarrhea while the ARB and diuretic were continued.</ref> Continue the normal saline, 1000 mL bolus followed by 125 mL/h, which is still running. Repeat chemistries in the morning.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.1 on arrival. Treated with calcium gluconate in the ED. Recheck potassium with the morning labs.
3. Hyperlipidemia: continue rosuvastatin 20 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6413280",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-04-10T01:55:00Z",
    "admitted": "2023-04-10T06:36:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-04-10T07:31:00Z",
    "bp": { "systolic_mmhg": 122, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 80,
    "resp_rate_per_min": 24,
    "temp_f": 99.2,
    "spo2_pct": 98,
    "weight_kg": 101.3
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
    "accession": "L23099-2573",
    "collected": "2023-04-10T02:24:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.1",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "98", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "57",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.55",
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
        "value": "169",
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
    "started": "2023-04-10T02:45:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
