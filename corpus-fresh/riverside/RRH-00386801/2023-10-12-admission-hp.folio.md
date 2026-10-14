---
folio: "0.1"
id: "01HCHTXK1012B5BEJ4RZMV0925"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00386801"
effective: "2023-10-12T09:37:00Z"
recorded: "2023-10-12T11:39:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** euglycemic diabetic ketoacidosis.

**History of present illness.** The patient is an adult with type 2 diabetes who presented to the ED last night feeling nauseated and weak, and was found to be acidotic with a glucose of 208. <ref id="precipitant">The ketoacidosis was precipitated by elective knee replacement surgery with prolonged pre-operative fasting while the SGLT2 inhibitor was continued.</ref> The patient takes metformin 500 mg twice daily with meals and atorvastatin 20 mg nightly, along with the SGLT2 inhibitor empagliflozin 10 mg daily.

**Allergies:** no known drug allergies.

**Exam.** Vitals at 04:27: BP 129/77, HR 106, RR 24, temperature 98.3 F, SpO2 95%. Tired-appearing, with deep, rapid respirations. Abdomen soft and non-tender.

**Results.** Basic metabolic panel from 23:37 on 10/11: sodium 133 (L), potassium 5.2 (H), chloride 100, bicarbonate 14 (L), anion gap 19 (H), urea nitrogen 39 (H), creatinine 0.88, eGFR 73, glucose 208 (H). Lipase 48.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. Continue the insulin infusion per DKA protocol at 0.1 units/kg/h, running since 00:30, together with D5 lactated Ringer's at 150 mL/h since glucose is near normal. Recheck chemistry regularly until the gap closes. <ref id="med_empagliflozin">Hold empagliflozin.</ref>
2. <ref id="med_metformin">Hold metformin while acidotic and NPO</ref>; resume when able.
3. <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 48 and no persistent abdominal pain.
4. Continue atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6084246",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-10-12T04:20:00Z",
    "admitted": "2023-10-12T08:30:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-10-12T09:27:00Z",
    "bp": { "systolic_mmhg": 129, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 106,
    "resp_rate_per_min": 24,
    "temp_f": 98.3,
    "spo2_pct": 95,
    "weight_kg": 78.5
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "dx_pancreatitis": {
    "type": "diagnosis",
    "label": "Acute pancreatitis",
    "icd10cm": "K85.90",
    "status": "ruled_out",
    "rank": "secondary"
  },
  "lipase": {
    "type": "result",
    "test": { "local_code": "LIPASE", "loinc": "3040-3", "name": "Lipase" },
    "accession": "L23284-2842",
    "collected": "2023-10-12T04:37:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "48",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23284-5067",
    "collected": "2023-10-12T04:37:00Z",
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
        "value": "5.2",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "14",
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
        "value": "39",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.88",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "73",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "208",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2023-10-12T05:30:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2023-10-12T05:30:00Z"
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
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while acidotic and NPO"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
