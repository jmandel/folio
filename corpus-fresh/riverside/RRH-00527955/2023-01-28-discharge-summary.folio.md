---
folio: "0.1"
id: "01GQXEFSN0WQ78ATRP2G9RCPN8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00527955"
effective: "2023-01-24T09:02:00Z"
effective_end: "2023-01-28T19:15:00Z"
recorded: "2023-01-29T00:23:00Z"
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

**Diagnoses.** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved</ref>. Acute pancreatitis was considered on admission and <ref id="dx_pancreatitis">ruled out</ref> by a normal lipase and resolution of the abdominal discomfort.

**Hospital course.** The patient presented with several days of fever, body aches and almost no oral intake, and was found to be markedly acidotic with a glucose only modestly raised. <ref id="precipitant">The ketoacidosis was precipitated by influenza with fever and poor oral intake.</ref> He was treated with an insulin infusion per DKA protocol and IV fluids, then transitioned to subcutaneous insulin once the anion gap closed. Endocrinology saw him and advised caution with SGLT2 inhibitors. His nausea resolved and he tolerated a regular diet.

**Condition at discharge.** Vitals at 10:15: BP 127/76, HR 106, RR 22, T 98.4 F, SpO2 94%. He feels well, is eating and drinking, and is comfortable at rest. No known drug allergies.

**Discharge labs.** On the 06:20 panel on 1/28: sodium 134, potassium 4.4, chloride 104, bicarbonate 24, anion gap 6, urea nitrogen 26, creatinine 1.54, eGFR 51, glucose 128.

**Discharge medications**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: do not resume until reviewed by his primary care physician</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>
- Lisinopril 40 mg daily: continue

**Follow-up.** Northgate Family Medicine within 1 week. At that visit the primary care physician will decide whether to restart empagliflozin and will recheck a basic metabolic panel. He was told to return for vomiting, abdominal pain, fast breathing, or inability to keep fluids down.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6706334",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-01-24T03:34:00Z",
    "admitted": "2023-01-24T09:02:00Z",
    "discharged": "2023-01-28T19:15:00Z",
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
    "taken": "2023-01-28T16:15:00Z",
    "bp": { "systolic_mmhg": 127, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 106,
    "resp_rate_per_min": 22,
    "temp_f": 98.4,
    "spo2_pct": 94,
    "weight_kg": 75.8
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23028-5924",
    "collected": "2023-01-28T12:20:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
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
        "value": "26",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.54",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "51",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "128",
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
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
