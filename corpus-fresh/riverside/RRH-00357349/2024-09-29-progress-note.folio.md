---
folio: "0.1"
id: "01J8Z2E3M0N39SMFZT9DV7H6VA"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00357349"
effective: "2024-09-29T12:58:00Z"
recorded: "2024-09-29T14:20:00Z"
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

**Subjective.** The patient reports minimal cough this morning and feels close to normal. Eating and drinking well, sleeping through the night, and walking in the hall without much breathlessness.

**Exam.** Vitals at 07:38: BP 121/73, HR 94, RR 24, T 98.1 F, SpO2 99%. The respiratory rate is higher on this reading, but the patient is comfortable at rest and speaking easily with saturation of 99%. Lungs are nearly clear, with a trace of crackles at the right base. Heart rhythm regular.

**Results.** <ref id="bmp">The basic metabolic panel drawn at 06:04 showed sodium 139, potassium 3.9, chloride 99, bicarbonate 24, anion gap 16, urea nitrogen 28 (H), creatinine 0.99, eGFR 56 (L) and glucose 164 (H)</ref>. Sodium has normalized and creatinine is now in the normal range.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, clinically much improved. Continue ceftriaxone and watch the respiratory rate through the day.
2. Kidney function has recovered with hydration. Repeat chemistry tomorrow morning.
3. Metformin and losartan remain on hold today. No known drug allergy.
4. Plan toward discharge if the patient continues to improve.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6327873",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-09-26T23:20:00Z",
    "admitted": "2024-09-27T04:46:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-09-29T12:38:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 94,
    "resp_rate_per_min": 24,
    "temp_f": 98.1,
    "spo2_pct": 99,
    "weight_kg": 78.5
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
    "accession": "L24273-5781",
    "collected": "2024-09-29T11:04:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "139", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "16", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "28",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.99",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "56",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "164",
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
    "started": "2024-09-27T00:10:00Z",
    "stopped": "2024-09-28T04:46:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  }
}
```
