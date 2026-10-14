---
folio: "0.1"
id: "01JYJKTBX0MWS6F5882NZTYTGR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00388366"
effective: "2025-06-25T02:06:00Z"
recorded: "2025-06-25T03:59:00Z"
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

**History of present illness.** The patient is a man with type 2 diabetes on insulin glargine, dulaglutide, metformin and an SGLT2 inhibitor, who was seen in the ED this afternoon feeling unwell, with nausea and fatigue. Labs drawn at 16:17 showed a bicarbonate of 8 with an anion gap of 32 and a glucose of only 242. The insulin infusion and D5 lactated Ringer's at 150 mL/h were started at 17:05 and are still running. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery.

**Home medications.** Dapagliflozin 10 mg daily, metformin 1000 mg twice daily with meals, lisinopril 20 mg daily, hydrochlorothiazide 25 mg daily, insulin glargine 10 units nightly and dulaglutide 0.5 mg weekly.

**Allergies:** no known drug allergies.

**Exam.** At 20:56: BP 110/66, HR 80, RR 21, temperature 98.2 F, SpO2 98%. Appears mildly dry, breathing deeply but comfortably. Abdomen soft.

**Results.** On the 16:17 panel sodium 134, potassium 5.3, chloride 94, bicarbonate 8, anion gap 32, urea nitrogen 35, creatinine 1.57 (eGFR 50), glucose 242.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. Continue the insulin infusion per DKA protocol with D5 lactated Ringer's, since glucose is not high. <ref id="med_dapagliflozin">Hold dapagliflozin.</ref> Continue home glargine and dulaglutide as listed.
2. Metformin: <ref id="med_metformin">hold while acidotic and NPO</ref>; resume when able.
3. Volume depletion with potassium 5.3 and creatinine 1.57: <ref id="med_lisinopril">hold lisinopril</ref> for volume depletion and potassium, and resume when eating. <ref id="med_hydrochlorothiazide">Hold hydrochlorothiazide</ref> for volume depletion as well, to be resumed when able.
4. Repeat chemistry on the usual DKA schedule to follow the gap and potassium.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6402248",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-06-24T20:55:00Z",
    "admitted": "2025-06-25T01:00:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-06-25T01:56:00Z",
    "bp": { "systolic_mmhg": 110, "diastolic_mmhg": 66 },
    "heart_rate_bpm": 80,
    "resp_rate_per_min": 21,
    "temp_f": 98.2,
    "spo2_pct": 98,
    "weight_kg": 79.1
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
    "accession": "L25175-5927",
    "collected": "2025-06-24T21:17:00Z",
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
        "value": "5.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "94",
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
        "value": "32",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "35",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.57",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "50",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "242",
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
    "started": "2025-06-24T22:05:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2025-06-24T22:05:00Z"
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
  "med_dulaglutide": {
    "type": "home_med",
    "drug_name": "dulaglutide pen",
    "rxnorm_ingredient": "1551291",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold for volume depletion and potassium; resume when eating"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold for volume depletion"
  }
}
```
