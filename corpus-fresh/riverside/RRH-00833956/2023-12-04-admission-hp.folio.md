---
folio: "0.1"
id: "01HGW38JC00RVG2WXJ18AEPW1Y"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00833956"
effective: "2023-12-05T02:07:00Z"
recorded: "2023-12-05T04:20:00Z"
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

**Reason for admission:** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>.

**History of present illness.** The patient presented to the ED this afternoon with nausea, abdominal discomfort and fast breathing. <ref id="precipitant">The ketoacidosis was precipitated by a weekend of heavy alcohol use with little food.</ref> Glucose on arrival was only 158, which is why this was not recognized as DKA at first glance. Home diabetes medicines are listed below.

**Medications and allergies.** Home medications: <ref id="med_empagliflozin">empagliflozin 10 mg daily is held</ref>; <ref id="med_metformin">metformin 1000 mg twice daily with meals is held while acidotic and NPO</ref>; <ref id="med_losartan">losartan 50 mg daily is continued</ref>. Also dulaglutide 0.5 mg weekly and insulin glargine 10 units nightly, both continued. No known drug allergies.

**Exam.** At 19:57: BP 129/77, HR 108, RR 20, T 99.1 F, SpO2 98%. Mildly tachycardic with deep, rapid respirations. Mucous membranes are dry. Abdomen is soft.

**Results.** BMP drawn at 16:12: sodium 132, potassium 4.6, chloride 98, bicarbonate 11, anion gap 23, urea nitrogen 27, creatinine 1.45, eGFR 39, glucose 158.

**Assessment and plan**

1. Euglycemic DKA with an open anion gap and bicarbonate of 11. The insulin infusion per DKA protocol at 0.1 units/kg/h was started at 16:51 and is still running, together with D5 lactated Ringer's at 150 mL/h, since glucose is near normal. Repeat BMP every 4 hours until the gap closes. Empagliflozin stays held, and endocrinology will be asked to see her in the morning.
2. Hyponatremia, sodium 132, likely volume depletion; expect improvement with fluids.
3. Kidney function: creatinine 1.45 with eGFR 39. Recheck with the morning labs and avoid nephrotoxins.
4. Alcohol use: monitor for withdrawal and encourage oral intake once the acidosis clears.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6699975",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-12-04T21:41:00Z",
    "admitted": "2023-12-05T01:02:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-12-05T01:57:00Z",
    "bp": { "systolic_mmhg": 129, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 108,
    "resp_rate_per_min": 20,
    "temp_f": 99.1,
    "spo2_pct": 98,
    "weight_kg": 70.2
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
    "accession": "L23338-7623",
    "collected": "2023-12-04T22:12:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.6", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "98", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "11",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "LL"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "27",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.45",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "39",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "158",
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
    "started": "2023-12-04T22:51:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2023-12-04T22:51:00Z"
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
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
