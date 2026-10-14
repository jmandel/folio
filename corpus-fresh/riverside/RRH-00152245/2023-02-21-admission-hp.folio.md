---
folio: "0.1"
id: "01GSVJS990FZTZ0S0KKV9TZJV2"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00152245"
effective: "2023-02-22T01:08:00Z"
recorded: "2023-02-22T03:31:00Z"
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

**Reason for admission:** <ref id="dx_dka">euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated</ref>.

**History of present illness.** The patient is a woman with type 2 diabetes and hypertension who came to the ED today feeling weak, nauseated and short of breath. <ref id="precipitant">The ketoacidosis was precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days.</ref> She was found to be markedly acidotic with a glucose of only 219, which fits the euglycemic picture. She has taken her diabetes and blood pressure pills at home, including a daily SGLT2 inhibitor, and has not had DKA before as far as she can recall.

**Allergies:** lisinopril (cough).

**Exam.** BP 117/70, HR 112, RR 17, T 98.1 F, SpO2 94% at 18:58. She looks tired and dry, with dry mucous membranes and mild tachycardia. Abdomen is soft. No focal neurologic findings.

**Results.** On the 13:41 panel sodium was 134, potassium 5.5, chloride 95, bicarbonate 8, anion gap 31, urea nitrogen 40, creatinine 1.17 and glucose 219.

**Assessment and plan**

1. Euglycemic DKA with a wide anion gap and bicarbonate of 8. The insulin infusion per DKA protocol (0.1 units/kg/h) has been running since 14:22, together with D5 lactated Ringer's at 150 mL/h since 14:22, because glucose is near normal. Recheck chemistries frequently and continue until the gap closes. <ref id="med_dapagliflozin">Hold dapagliflozin 10 mg daily.</ref>
2. Diabetes: <ref id="med_metformin">hold metformin 1000 mg twice daily</ref> while she is acidotic and NPO.
3. Hypertension and hyperkalemia: potassium 5.5 with volume depletion. <ref id="med_losartan">Hold losartan 50 mg daily</ref> and resume when she is eating and potassium has settled.
4. Kidney function: creatinine 1.17 with eGFR 47, likely prerenal. Avoid nephrotoxins and follow with fluids.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6094778",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-02-21T19:12:00Z",
    "admitted": "2023-02-22T00:00:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-02-22T00:58:00Z",
    "bp": { "systolic_mmhg": 117, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 112,
    "resp_rate_per_min": 17,
    "temp_f": 98.1,
    "spo2_pct": 94,
    "weight_kg": 98.4
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23052-5984",
    "collected": "2023-02-21T19:41:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "134",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.5",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "95",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "8",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "LL"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "31",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "40",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.17",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "47",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "219",
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
    "started": "2023-02-21T20:22:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2023-02-21T20:22:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "cough",
    "severity": "mild"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while acidotic and NPO"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold for volume depletion and potassium; resume when eating"
  }
}
```
