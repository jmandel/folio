---
folio: "0.1"
id: "01HZZHAP10FF8N90T6C55WCPER"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00782468"
effective: "2024-06-06T01:03:00Z"
effective_end: "2024-06-09T19:15:00Z"
recorded: "2024-06-09T22:19:00Z"
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

**Diagnoses.** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, resolved. <ref id="dx_pancreatitis">Pancreatitis ruled out</ref>.

**Hospital course.** The patient presented with weakness, shortness of breath and several days of vomiting. He was found to have a wide anion gap acidosis with a glucose of only 219 on arrival. <ref id="precipitant">The ketoacidosis was precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days.</ref> He was treated with an insulin infusion per DKA protocol and intravenous fluids, then transitioned to subcutaneous insulin glargine. The acidosis cleared over the next two days and he resumed eating normally. Because of upper abdominal discomfort at presentation, pancreatitis was considered; it was ruled out, with a normal lipase of 40 and a benign abdomen on exam.

**Condition at discharge.** Vitals at 11:15: BP 126/76, HR 91, RR 21, T 98.2 F, SpO2 97%. He is eating, walking and feels well. Labs on 6/9 at 06:09: sodium 133, potassium 4.4, chloride 104, bicarbonate 21, anion gap 8, urea nitrogen 23, creatinine 1.24 (eGFR 68), glucose 173. Sodium is mildly low and will be rechecked.

**Allergies.** No known drug allergies.

**Discharge medications**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: do not resume until reviewed by his primary care physician.</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue.</ref>
- <ref id="med_losartan">Losartan 50 mg daily: continue.</ref>
- Atorvastatin 20 mg nightly: continue.

**Follow-up.** He will see his primary care physician at Northgate Family Medicine within 1 week to decide whether to restart empagliflozin and to recheck a basic metabolic panel. He was advised to return for vomiting that does not stop, abdominal pain, fast breathing or marked weakness.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6974847",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-06-05T19:55:00Z",
    "admitted": "2024-06-06T01:03:00Z",
    "discharged": "2024-06-09T19:15:00Z",
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
    "taken": "2024-06-09T16:15:00Z",
    "bp": { "systolic_mmhg": 126, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 21,
    "temp_f": 98.2,
    "spo2_pct": 97,
    "weight_kg": 86.5
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24161-6914",
    "collected": "2024-06-09T11:09:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "23", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.24",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "68",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
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
    "purpose": "Decide whether to restart empagliflozin; recheck basic metabolic panel"
  }
}
```
