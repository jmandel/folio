---
folio: "0.1"
id: "01KKDV0960ETWMB9N3P6CS5VKR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00161352"
effective: "2026-03-11T04:33:00Z"
recorded: "2026-03-11T06:58:00Z"
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

**History.** The patient presented to the ED this afternoon feeling unwell after several days of fever, aches and poor oral intake. <ref id="precipitant">The ketoacidosis was precipitated by influenza with fever and poor oral intake.</ref> At home the patient takes dapagliflozin, metformin, insulin glargine 14 units nightly and atorvastatin 40 mg nightly. There are no known drug allergies.

**Exam.** Vitals at 23:23: BP 130/78, HR 90, RR 20, T 98.6 F, SpO2 98%. The patient is comfortable on the insulin infusion, with no abdominal tenderness on my examination.

**Results.** The 17:04 panel showed sodium 132, potassium 5.5, chloride 100, bicarbonate 13, anion gap 19, urea nitrogen 30, creatinine 2.90 (eGFR 23) and glucose 211. Lipase 55.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. The insulin infusion per DKA protocol at 0.1 units/kg/h has been running since 17:58, together with D5 lactated Ringer's at 150 mL/h, since glucose is only modestly elevated. <ref id="med_dapagliflozin">Dapagliflozin is held.</ref> Continue to follow the anion gap and bicarbonate on serial panels.
2. Metformin: <ref id="med_metformin">held while acidotic and NPO</ref>, to be resumed when able.
3. <ref id="dx_pancreatitis">Acute pancreatitis ruled out</ref>: lipase 55 and no abdominal findings.
4. Hyperkalemia and acute kidney injury on the admission panel (potassium 5.5, creatinine 2.90): recheck with the next panel as fluids and insulin take effect.
5. Continue insulin glargine 14 units nightly and atorvastatin 40 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6239984",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-03-10T21:48:00Z",
    "admitted": "2026-03-11T03:34:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-03-11T04:23:00Z",
    "bp": { "systolic_mmhg": 130, "diastolic_mmhg": 78 },
    "heart_rate_bpm": 90,
    "resp_rate_per_min": 20,
    "temp_f": 98.6,
    "spo2_pct": 98,
    "weight_kg": 116.9
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
    "accession": "L26069-3025",
    "collected": "2026-03-10T22:04:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "55",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L26069-8725",
    "collected": "2026-03-10T22:04:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.5",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "13",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.90",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "23",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "211",
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
    "started": "2026-03-10T22:58:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2026-03-10T22:58:00Z"
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
    "dose_text": "14 units",
    "sig": "14 units SubQ nightly",
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
