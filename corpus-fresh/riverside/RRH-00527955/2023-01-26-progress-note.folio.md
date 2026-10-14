---
folio: "0.1"
id: "01GQQ7H760T60S85DWGJP77K9M"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00527955"
effective: "2023-01-26T13:30:00Z"
recorded: "2023-01-26T14:26:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Subjective.** No nausea or abdominal pain overnight. He is eating his meals.

**Exam.** Vitals at 07:10: BP 129/77, HR 87, RR 21, T 99 F, SpO2 99%. Alert and comfortable, lungs clear, abdomen soft.

**Results.** The <ref id="bmp">06:06 panel shows sodium 132, potassium 4.4, chloride 101, bicarbonate 19, anion gap 12, urea nitrogen 21, creatinine 1.54, eGFR 51, and glucose 120</ref>. Bicarbonate has dipped from yesterday, though the gap remains closed, and sodium is lower.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, resolved biochemically and now on subcutaneous insulin. Continue <ref id="sc_glargine">glargine 11 units daily</ref>. Glucose is in a good range on this dose.
2. Mild low sodium and bicarbonate on this morning's panel, without a gap. Encourage oral intake and repeat the panel tomorrow.
3. Kidney function is slowly improving, with creatinine 1.54 down from 1.66.
4. Empagliflozin and metformin remain on hold. Lisinopril continues.
5. Anticipate discharge planning once labs are stable and diabetes teaching is complete.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6706334",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-01-24T03:34:00Z",
    "admitted": "2023-01-24T09:02:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-01-26T13:10:00Z",
    "bp": { "systolic_mmhg": 129, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 87,
    "resp_rate_per_min": 21,
    "temp_f": 99,
    "spo2_pct": 99,
    "weight_kg": 75.8
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
    "accession": "L23026-8509",
    "collected": "2023-01-26T12:06:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "21", "unit": "mg/dL", "ref_range": "8-23" },
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
        "value": "120",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "11 units daily",
    "started": "2023-01-25T13:00:00Z"
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
    "status": "held"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
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
  }
}
```
