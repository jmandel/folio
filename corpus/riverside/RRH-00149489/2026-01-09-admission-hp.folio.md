---
folio: "0.1"
id: "01KEHD2EZ0BTZ3AN2594AN7859"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00149489"
effective: "2026-01-09T11:21:00Z"
recorded: "2026-01-09T12:53:00Z"
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

**Reason for admission:** euglycemic diabetic ketoacidosis.

**History of present illness.** The patient came to the ED late last night with several days of fever, poor appetite and minimal oral intake, and was found to be markedly acidotic with a glucose of only 183. <ref id="precipitant">The ketoacidosis was precipitated by influenza with fever and poor oral intake.</ref> They take <ref id="med_empagliflozin">empagliflozin 10 mg daily</ref> at home.

**Allergies:** none known.

**Exam.** Vitals at 05:11: BP 106/64, HR 89, RR 18, temperature 98.1 F, SpO2 96%. Comfortable, mucous membranes slightly dry, breathing unlabored. Abdomen soft.

**Results.** On the 23:54 panel sodium 130, potassium 5.5, chloride 94, bicarbonate 8, anion gap 28, urea nitrogen 24, creatinine 1.91, eGFR 28, glucose 183. Lipase 22.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. Continue the insulin infusion per DKA protocol (0.1 units/kg/h, started 00:30) with D5 lactated Ringer's at 150 mL/h, since glucose is near normal. Hold empagliflozin.
2. <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 22.
3. <ref id="med_metformin">Hold metformin</ref> while acidotic and NPO.
4. <ref id="med_lisinopril">Hold lisinopril</ref> for volume depletion and potassium of 5.5; resume when eating.
5. Continue dulaglutide and rosuvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6141394",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-01-09T05:20:00Z",
    "admitted": "2026-01-09T10:09:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-01-09T11:11:00Z",
    "bp": { "systolic_mmhg": 106, "diastolic_mmhg": 64 },
    "heart_rate_bpm": 89,
    "resp_rate_per_min": 18,
    "temp_f": 98.1,
    "spo2_pct": 96,
    "weight_kg": 63.8
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
    "accession": "L26008-9171",
    "collected": "2026-01-09T05:54:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "22",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L26008-6460",
    "collected": "2026-01-09T05:54:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "130",
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
        "value": "28",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "24",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.91",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "28",
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
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2026-01-09T06:30:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2026-01-09T06:30:00Z"
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
  "med_dulaglutide": {
    "type": "home_med",
    "drug_name": "dulaglutide pen",
    "rxnorm_ingredient": "1551291",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold for volume depletion and potassium; resume when eating"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 100 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
