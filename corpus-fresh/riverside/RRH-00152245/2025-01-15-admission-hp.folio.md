---
folio: "0.1"
id: "01JHPP7EP01FM3S17ZWXSRPEKG"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00152245"
effective: "2025-01-16T02:48:00Z"
recorded: "2025-01-16T04:34:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** <ref id="dx_aki">acute kidney injury</ref> with <ref id="dx_hyperk">hyperkalemia</ref>.

**History of present illness.** The patient has type 2 diabetes and hypertension and came to the ED after several days of watery diarrhea, poor intake and lightheadedness. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> In the ED potassium was 6.2 and creatinine 2.46, and she received IV calcium gluconate and saline.

**Allergies:** lisinopril (cough); dapagliflozin (diabetic ketoacidosis).

**Exam.** BP 117/70, HR 106, RR 24, T 98.1 F, SpO2 96% at 20:38. She is dry-appearing and tachycardic, with dry mucous membranes. Abdomen is soft and nontender.

**Results.** On the 16:02 panel sodium was 135, potassium 6.2, chloride 99, bicarbonate 21, anion gap 15, urea nitrogen 32, creatinine 2.46, eGFR 19 and glucose 181.

**Assessment and plan**

1. Acute kidney injury, prerenal from volume loss. Continue normal saline, a 1000 mL bolus then 125 mL/h since 16:24. <ref id="med_losartan">Hold losartan until creatinine is back to baseline.</ref> Avoid nephrotoxins.
2. Hyperkalemia, potassium 6.2, treated with calcium gluconate 1 g at 16:14. Repeat potassium in the morning.
3. Diabetes: <ref id="med_metformin">hold metformin during the acute illness.</ref>
4. Dapagliflozin remains on the allergy list because of prior ketoacidosis.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6565340",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-01-15T21:34:00Z",
    "admitted": "2025-01-16T01:55:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-01-16T02:38:00Z",
    "bp": { "systolic_mmhg": 117, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 106,
    "resp_rate_per_min": 24,
    "temp_f": 98.1,
    "spo2_pct": 96,
    "weight_kg": 98.4
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
    "accession": "L25015-4812",
    "collected": "2025-01-15T22:02:00Z",
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
        "value": "6.2",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "15", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "32",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.46",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "19",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "181",
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
    "started": "2025-01-15T22:24:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "cough",
    "severity": "mild"
  },
  "alg_dapagliflozin": {
    "type": "allergy",
    "substance": "dapagliflozin",
    "rxnorm_ingredient": "1488564",
    "reaction": "diabetic ketoacidosis",
    "severity": "severe"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold during acute illness"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold until creatinine back to baseline"
  }
}
```
