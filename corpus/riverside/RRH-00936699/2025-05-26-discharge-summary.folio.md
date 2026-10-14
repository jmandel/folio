---
folio: "0.1"
id: "01JW73ERE0ZRT648HFM86Z5M68"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00936699"
effective: "2025-05-23T01:24:00Z"
effective_end: "2025-05-26T15:15:00Z"
recorded: "2025-05-26T20:10:00Z"
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

**Diagnosis:** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, resolved.

**Hospital course.** She presented with weakness, nausea and shortness of breath and was found to be in ketoacidosis with a near-normal glucose. <ref id="precipitant">The ketoacidosis was precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days.</ref> She was treated with an insulin infusion and dextrose-containing fluids, then moved to subcutaneous basal insulin. <ref id="dx_pancreatitis">Acute pancreatitis was ruled out</ref> with a normal lipase of 26. Her symptoms resolved and she is eating normally.

**Condition at discharge.** On the day of discharge: BP 131/79, HR 99, RR 17, T 98.4 F, SpO2 95%. The 5/26 06:18 panel showed sodium 135, potassium 4.3, chloride 102, bicarbonate 19, anion gap 14, urea nitrogen 18, creatinine 1.94 (eGFR 38), glucose 183. Kidney function remains below normal and should be rechecked.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: do not resume until reviewed by her PCP</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue</ref>
- Glipizide 5 mg daily: continue
- Insulin glargine 10 units subcutaneously nightly: continue
- Atorvastatin 40 mg nightly: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to decide whether empagliflozin should be restarted and to recheck a basic metabolic panel. She was told to return for vomiting, inability to eat or drink, abdominal pain or fast breathing.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6078842",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-05-22T22:20:00Z",
    "admitted": "2025-05-23T01:24:00Z",
    "discharged": "2025-05-26T15:15:00Z",
    "disposition": "home"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "dx_pancreatitis": {
    "type": "diagnosis",
    "label": "Acute pancreatitis",
    "icd10cm": "K85.90",
    "status": "ruled_out",
    "rank": "secondary"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-05-26T12:15:00Z",
    "bp": { "systolic_mmhg": 131, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 17,
    "temp_f": 98.4,
    "spo2_pct": 95,
    "weight_kg": 111.6
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25146-6255",
    "collected": "2025-05-26T11:18:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.94",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "38",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "183",
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
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart empagliflozin; recheck basic metabolic panel"
  }
}
```
