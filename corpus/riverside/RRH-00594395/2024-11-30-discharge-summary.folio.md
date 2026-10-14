---
folio: "0.1"
id: "01JDZQGW90GVGBZYMZNK7GBYP7"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00594395"
effective: "2024-11-28T02:05:00Z"
effective_end: "2024-11-30T20:45:00Z"
recorded: "2024-11-30T23:47:00Z"
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

**Diagnosis:** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved.</ref>

**Hospital course.** The patient is a man with type 2 diabetes, hypertension and chronic kidney disease who presented on 11/27 with ketoacidosis and a glucose of 183. He was treated with an insulin infusion per DKA protocol and IV fluids, and then transitioned to subcutaneous insulin. His gap closed and his bicarbonate normalized. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. Endocrinology saw him in consultation.

**Condition at discharge.** Vitals at 11:45: BP 122/73, HR 89, RR 20, T 98.8 F, SpO2 97%. On the 06:28 panel on 11/30: sodium 133, potassium 4.1, chloride 99, bicarbonate 23, anion gap 11, urea nitrogen 14, creatinine 2.29, eGFR 35, glucose 178. Creatinine has improved from 2.83 on admission but remains elevated.

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily: do not resume until reviewed by his PCP.</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue.</ref>
- <ref id="med_losartan">Losartan 100 mg daily: continue.</ref>
- Atorvastatin 20 mg nightly: continue.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week, to decide whether to restart dapagliflozin and to recheck a basic metabolic panel.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6654902",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-27T21:41:00Z",
    "admitted": "2024-11-28T02:05:00Z",
    "discharged": "2024-11-30T20:45:00Z",
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
  "vs_1": {
    "type": "vitals",
    "taken": "2024-11-30T17:45:00Z",
    "bp": { "systolic_mmhg": 122, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 89,
    "resp_rate_per_min": 20,
    "temp_f": 98.8,
    "spo2_pct": 97,
    "weight_kg": 89
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24335-0583",
    "collected": "2024-11-30T12:28:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.1", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "14", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.29",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "35",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "178",
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
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
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart dapagliflozin; recheck basic metabolic panel"
  }
}
```
