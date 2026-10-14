---
folio: "0.1"
id: "01HD2VRWQ0ZXDVTG2NG51N6N67"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00063823"
effective: "2023-10-19T00:38:00Z"
recorded: "2023-10-19T02:21:00Z"
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

**History.** The patient is a man with diabetes on insulin glargine and oral agents who presented to the ED this afternoon feeling unwell, with fatigue, nausea and rapid breathing. He has had little to eat or drink over the past few days. <ref id="precipitant">The ketoacidosis was precipitated by influenza with fever and poor oral intake.</ref> His glucose on arrival was only 162, which is why this is euglycemic. He has no known drug allergies.

**Home medications.** He takes <ref id="med_dapagliflozin">dapagliflozin 10 mg daily, held</ref>. He also takes <ref id="med_metformin">metformin 1000 mg twice daily with meals, held while acidotic and NPO</ref>. Insulin glargine 10 units nightly and atorvastatin 40 mg nightly are continued.

**Exam.** At 19:28: BP 129/77, HR 104, RR 21, T 98.3 F, SpO2 94%. He is tired but alert, with dry mucous membranes and deep, rapid respirations. The abdomen is soft.

**Results.** On the 15:28 panel sodium 134, potassium 4.8, chloride 93, bicarbonate 9, anion gap 32, urea nitrogen 32, creatinine 2.14 (eGFR 35), glucose 162. Lipase 53.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. The insulin infusion per DKA protocol (0.1 units/kg/h, started 16:15) and D5 lactated Ringer's at 150 mL/h continue, with dextrose because glucose is near normal. Repeat chemistries through the night until the anion gap closes.
2. <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 53 and no significant abdominal pain.
3. Kidney function: creatinine 2.14 on arrival, likely from volume depletion. Recheck with the morning labs.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6455511",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-10-18T20:05:00Z",
    "admitted": "2023-10-18T23:45:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-10-19T00:28:00Z",
    "bp": { "systolic_mmhg": 129, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 104,
    "resp_rate_per_min": 21,
    "temp_f": 98.3,
    "spo2_pct": 94,
    "weight_kg": 106.9
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
    "accession": "L23291-6242",
    "collected": "2023-10-18T20:28:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "53",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23291-1025",
    "collected": "2023-10-18T20:28:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.8", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "93",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "9",
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
        "value": "32",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.14",
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
        "value": "162",
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
    "started": "2023-10-18T21:15:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2023-10-18T21:15:00Z"
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
  }
}
```
