---
folio: "0.1"
id: "01JTS213C0QN94DAXVKGZ5ZBE5"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00750253"
effective: "2025-05-03T07:13:00Z"
effective_end: "2025-05-08T19:00:00Z"
recorded: "2025-05-08T23:00:00Z"
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

**Diagnosis at discharge:** <ref id="dx_pneumonia">community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient was admitted through the ED with cough, low-grade fever and poor oral intake, and was found to have pneumonia along with reduced kidney function. Treatment was ceftriaxone 1 g IV every 24 hours and normal saline at 75 mL/h, with the saline stopped on 5/4 at 02:13. Cough, fever and breathing improved steadily over the stay. Creatinine was 1.85 on admission and had improved to 1.38 by the day of discharge.

**Discharge exam.** Vitals at 11:00: BP 119/71, HR 95, RR 19, T 98 F, SpO2 95%. Comfortable, breathing easily, lungs clear of significant crackles.

**Results at discharge.** Basic metabolic panel drawn 5/8 at 06:07: sodium 133 (L), potassium 3.9, chloride 104, bicarbonate 25, anion gap 4 (L), urea nitrogen 31 (H), creatinine 1.38 (H), eGFR 49 (L), glucose 143 (H).

**Allergies:** none known.

**Discharge medications**

- <ref id="med_losartan">Losartan 100 mg by mouth daily, continue</ref>
- <ref id="med_metformin">Metformin 500 mg by mouth twice daily with meals, continue</ref>
- Dapagliflozin 10 mg by mouth daily, continue
- Chlorthalidone 12.5 mg (half of a 25 mg tablet) by mouth daily, continue
- Amlodipine 5 mg by mouth daily, continue
- Rosuvastatin 20 mg by mouth nightly, continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and chest exam.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6115943",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-05-03T01:20:00Z",
    "admitted": "2025-05-03T07:13:00Z",
    "discharged": "2025-05-08T19:00:00Z",
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
    "taken": "2025-05-08T16:00:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 95,
    "resp_rate_per_min": 19,
    "temp_f": 98,
    "spo2_pct": 95,
    "weight_kg": 86.8
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25128-2007",
    "collected": "2025-05-08T11:07:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "4",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "31",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.38",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
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
        "value": "143",
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
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
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
