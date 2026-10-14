---
folio: "0.1"
id: "01HDCSVQC0YZH0AZN79DFMJSQ3"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00063823"
effective: "2023-10-18T23:45:00Z"
effective_end: "2023-10-22T18:45:00Z"
recorded: "2023-10-22T23:00:00Z"
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

**Diagnosis:** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved</ref>.

**Hospital course.** The patient presented with fatigue, nausea and fast breathing and was found to have a wide anion gap acidosis with a near-normal glucose. <ref id="precipitant">The ketoacidosis was precipitated by influenza with fever and poor oral intake.</ref> He was treated with an insulin infusion per DKA protocol and dextrose-containing fluids, then transitioned to subcutaneous insulin glargine. The anion gap closed the morning after admission and stayed closed. <ref id="dx_pancreatitis">Acute pancreatitis was ruled out</ref> on the basis of a normal-range lipase and a benign abdominal exam.

**At discharge.** Vitals at 10:45: BP 119/71, HR 85, RR 24, T 98.8 F, SpO2 97%. He is eating and feels well. The final panel on 10/22 at 06:24 showed sodium 132, potassium 4.4, chloride 103, bicarbonate 24, anion gap 5, urea nitrogen 15, creatinine 1.98 (eGFR 38) and glucose 121. Kidney function has settled at a mildly reduced level, which his primary care physician should follow.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily: held. Do not resume until reviewed by his PCP.</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue.</ref>
- Insulin glargine 10 units subcutaneously nightly: continue.
- Atorvastatin 40 mg nightly: continue.

**Follow-up.** He should see his primary care physician at Northgate Family Medicine within 1 week to decide whether to restart dapagliflozin and to recheck a basic metabolic panel. He was advised to return for vomiting, abdominal pain, fast breathing or inability to keep fluids down.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6455511",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-10-18T20:05:00Z",
    "admitted": "2023-10-18T23:45:00Z",
    "discharged": "2023-10-22T18:45:00Z",
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
    "taken": "2023-10-22T15:45:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 85,
    "resp_rate_per_min": 24,
    "temp_f": 98.8,
    "spo2_pct": 97,
    "weight_kg": 106.9
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23295-7791",
    "collected": "2023-10-22T11:24:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "132",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "5",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "15", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.98",
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
        "value": "121",
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
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
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
    "purpose": "Decide whether to restart dapagliflozin; recheck basic metabolic panel"
  }
}
```
