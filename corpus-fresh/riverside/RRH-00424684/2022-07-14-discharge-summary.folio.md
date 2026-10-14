---
folio: "0.1"
id: "01G7ZNAXP043Q6YDFMP3DTGQ35"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00424684"
effective: "2022-07-10T06:46:00Z"
effective_end: "2022-07-14T20:30:00Z"
recorded: "2022-07-15T00:50:00Z"
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

**Diagnosis.** <ref id="dx_pneumonia">Community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient was admitted through the emergency department with pneumonia and treated in the hospital. Intravenous fluids were given early in the stay for abnormal chemistry and an elevated creatinine, and were stopped on 7/11. Over the following days the patient's breathing and vital signs improved. Allergy list: NKDA.

**Condition at discharge.** Vitals at 12:30: BP 129/77, HR 85, RR 23, T 98.4 F, SpO2 95%. The patient is comfortable, eating, and ready to go home.

**Results at discharge.** The 7/14 panel drawn at 06:19: sodium 135 (L), potassium 3.9, chloride 100, bicarbonate 25, anion gap 10, urea nitrogen 17, creatinine 1.24, eGFR 68, glucose 145 (H). Kidney function is back to the normal range, and the mild sodium reduction is the only flagged electrolyte.

**Discharge medications**

- <ref id="med_metformin">Metformin 500 mg tablet, 1 tablet by mouth twice daily with meals: continue</ref>
- Glipizide 5 mg tablet, 1 tablet by mouth daily: continue
- Losartan 100 mg tablet, 1 tablet by mouth daily: continue
- Rosuvastatin 20 mg tablet, 1 tablet by mouth nightly: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and chest exam.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6541337",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-07-10T00:34:00Z",
    "admitted": "2022-07-10T06:46:00Z",
    "discharged": "2022-07-14T20:30:00Z",
    "disposition": "home"
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-07-14T17:30:00Z",
    "bp": { "systolic_mmhg": 129, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 85,
    "resp_rate_per_min": 23,
    "temp_f": 98.4,
    "spo2_pct": 95,
    "weight_kg": 92.7
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L22195-0060",
    "collected": "2022-07-14T11:19:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "17", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.24",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "68",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "145",
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
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Recheck symptoms and chest exam"
  }
}
```
