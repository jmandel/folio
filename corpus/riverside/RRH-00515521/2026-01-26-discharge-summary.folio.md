---
folio: "0.1"
id: "01KFY41FF0AJEQC9MGHT494H9N"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00515521"
effective: "2026-01-23T00:42:00Z"
effective_end: "2026-01-26T18:00:00Z"
recorded: "2026-01-26T21:41:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Principal diagnosis:** <ref id="dx_pneumonia">community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient presented to the emergency department with cough and malaise and was found to have pneumonia. Admission labs showed a sodium of 130, bicarbonate of 18, urea nitrogen of 50 and creatinine of 1.69. Intravenous saline was given from the day of admission until the evening of 1/23, and these values improved steadily. Cough and breathing gradually improved over the stay, and vitals remained stable.

**Condition at discharge.** The patient is feeling well, eating and drinking normally and walking without difficulty. Vitals at 09:00: BP 130/78, HR 84, RR 23, T 98.7 F, SpO2 97%. Lungs are clear to the extent expected, with unlabored breathing.

**Discharge labs.** Basic metabolic panel drawn 1/26 at 06:07: sodium 133 (L), potassium 3.9, chloride 101, bicarbonate 21 (L), anion gap 11, urea nitrogen 33 (H), creatinine 1.25 with an eGFR of 60, and glucose 102 (H). Creatinine has returned to the normal range. Sodium and bicarbonate remain slightly low and should be rechecked at follow-up.

**Allergies:** no known drug allergies.

**Follow-up.** The patient should see primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient should return sooner for worsening cough, shortness of breath or fever. The patient understands and agrees with this plan.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6747190",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-01-22T20:34:00Z",
    "admitted": "2026-01-23T00:42:00Z",
    "discharged": "2026-01-26T18:00:00Z",
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
    "taken": "2026-01-26T15:00:00Z",
    "bp": { "systolic_mmhg": 130, "diastolic_mmhg": 78 },
    "heart_rate_bpm": 84,
    "resp_rate_per_min": 23,
    "temp_f": 98.7,
    "spo2_pct": 97,
    "weight_kg": 76
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L26026-8549",
    "collected": "2026-01-26T12:07:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "33",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.25",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "60",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "102",
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
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
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
