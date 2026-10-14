---
folio: "0.1"
id: "01J8SXMNM0C0YHQDKZQ3VDGZS0"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00357349"
effective: "2024-09-27T12:55:00Z"
recorded: "2024-09-27T14:20:00Z"
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

**Subjective.** The patient slept reasonably well overnight and reports the cough is a little looser this morning. Breathing feels easier. No new chest pain, nausea or vomiting, and the patient is drinking and starting to eat.

**Exam.** Vitals at 07:35: BP 136/82, HR 79, RR 19, T 98.2 F, SpO2 97%. Comfortable at rest. Crackles persist at the right base but are less prominent than on admission. Heart rhythm regular.

**Results.** <ref id="bmp">The basic metabolic panel drawn at 06:15 showed sodium 133 (L), potassium 4.2, chloride 99, bicarbonate 26, anion gap 8, urea nitrogen 18, creatinine 1.11 (H), eGFR 49 (L) and glucose 108 (H)</ref>. Compared with admission, the urea nitrogen has fallen from 47 to 18 and the bicarbonate has corrected.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, improving clinically. Continue ceftriaxone and the current monitoring.
2. Volume depletion, improving with fluids. Normal saline at 75 mL/h is still running. Sodium is trending up and creatinine is coming down toward baseline.
3. Losartan and metformin remain on hold for now. No known drug allergy.
4. Encourage oral intake and walking in the hallway today.

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
    "taken": "2024-09-27T12:35:00Z",
    "bp": { "systolic_mmhg": 136, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 79,
    "resp_rate_per_min": 19,
    "temp_f": 98.2,
    "spo2_pct": 97,
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
    "accession": "L24271-2149",
    "collected": "2024-09-27T11:15:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.2", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.11",
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
        "value": "108",
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
    "started": "2024-09-27T00:10:00Z"
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
