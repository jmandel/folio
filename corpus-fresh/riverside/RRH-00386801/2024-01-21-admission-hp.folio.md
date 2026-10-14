---
folio: "0.1"
id: "01HMNNNZE09Y6RBXEX2J7AHCYQ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00386801"
effective: "2024-01-21T07:02:00Z"
recorded: "2024-01-21T09:30:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient is an adult with type 2 diabetes who presented to the ED this evening feeling weak, with low urine output and poor drinking. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake.</ref> Home medications also include metformin 500 mg twice daily with meals and atorvastatin 20 mg nightly.

**Allergies:** empagliflozin (diabetic ketoacidosis).

**Exam.** Vitals at 00:52: BP 109/65, HR 102, RR 18, temperature 98.6 F, SpO2 98%. Dry mucous membranes, lungs clear, abdomen soft, no edema.

**Results.** Basic metabolic panel from 19:50: sodium 135 (L), potassium 6.5 (HH), chloride 100, bicarbonate 18 (L), anion gap 17 (H), urea nitrogen 51 (H), creatinine 1.89 (H), eGFR 29 (L), glucose 173 (H).

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, prerenal in character. Continue normal saline at 125 mL/h, running since 20:10 after the 1000 mL bolus. Avoid nephrotoxins and repeat chemistry in the morning.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.5 on arrival, treated with calcium gluconate in the ED. Recheck potassium with the morning panel.
3. Diabetes: <ref id="med_metformin">hold metformin during acute illness</ref>; resume when able.
4. Continue atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6786538",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-01-21T01:20:00Z",
    "admitted": "2024-01-21T05:44:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-01-21T06:52:00Z",
    "bp": { "systolic_mmhg": 109, "diastolic_mmhg": 65 },
    "heart_rate_bpm": 102,
    "resp_rate_per_min": 18,
    "temp_f": 98.6,
    "spo2_pct": 98,
    "weight_kg": 78.5
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
    "accession": "L24020-8390",
    "collected": "2024-01-21T01:50:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.5",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "18",
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
        "value": "51",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.89",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "29",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "173",
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
    "started": "2024-01-21T02:10:00Z"
  },
  "alg_empagliflozin": {
    "type": "allergy",
    "substance": "empagliflozin",
    "rxnorm_ingredient": "1545653",
    "reaction": "diabetic ketoacidosis",
    "severity": "severe"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 500 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "500 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold during acute illness"
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
