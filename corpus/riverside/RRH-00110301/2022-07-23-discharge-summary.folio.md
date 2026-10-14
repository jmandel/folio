---
folio: "0.1"
id: "01G8PY23B0VGBFV0YTV9MG8QQB"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00110301"
effective: "2022-07-20T22:32:00Z"
effective_end: "2022-07-23T20:30:00Z"
recorded: "2022-07-24T01:45:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Admission diagnosis:** community-acquired pneumonia.

**Discharge diagnosis:** <ref id="dx_pneumonia">community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient presented to the emergency department on 7/20 with several days of cough, fatigue and mild shortness of breath, and was found to have pneumonia. They were admitted to the hospital medicine service, treated with intravenous antibiotics, and given intravenous saline for dehydration, with elevated urea nitrogen and creatinine on arrival. Breathing and energy improved steadily over three days. The saline was stopped on 7/21, and kidney function continued to improve with oral fluids.

**Condition at discharge.** Improved and eating and drinking well. Vitals at 12:30: BP 130/78, HR 107, RR 21, temperature 98.5 F, SpO2 94%. The patient is walking without distress and has a stable cough that continues to improve.

**Discharge labs.** Basic metabolic panel on 7/23 at 06:09: sodium 136, potassium 3.9, chloride 104, bicarbonate 26, anion gap 6 (low), urea nitrogen 32 (high), creatinine 0.99, eGFR 68, glucose 116 (high). Creatinine has returned to the normal range.

**Allergies:** no known drug allergies.

**Medications.** Home medications are continued unchanged, as listed on the reconciled medication list given to the patient.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week, to recheck symptoms and the chest exam. The patient should return sooner for worsening shortness of breath, fever that returns, or chest pain.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6941198",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-07-20T19:05:00Z",
    "admitted": "2022-07-20T22:32:00Z",
    "discharged": "2022-07-23T20:30:00Z",
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
    "taken": "2022-07-23T17:30:00Z",
    "bp": { "systolic_mmhg": 130, "diastolic_mmhg": 78 },
    "heart_rate_bpm": 107,
    "resp_rate_per_min": 21,
    "temp_f": 98.5,
    "spo2_pct": 94,
    "weight_kg": 88
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L22204-0823",
    "collected": "2022-07-23T11:09:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
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
        "value": "32",
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
        "value": "68",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "116",
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
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
