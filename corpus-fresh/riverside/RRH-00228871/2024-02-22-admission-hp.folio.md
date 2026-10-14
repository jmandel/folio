---
folio: "0.1"
id: "01HQA0RTM01TZ5QM5HS59W3XTJ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00228871"
effective: "2024-02-23T01:28:00Z"
recorded: "2024-02-23T03:40:00Z"
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

**Reason for admission:** <ref id="dx_dka">euglycemic diabetic ketoacidosis, associated with an SGLT2 inhibitor</ref>.

**History.** The patient came to the ED today with malaise and rapid breathing and was found to be markedly acidotic with a glucose of only 205. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. At home the patient takes empagliflozin 10 mg daily, metformin 1000 mg twice daily with meals, glipizide 5 mg daily and levothyroxine 75 mcg daily. Allergies: no known drug allergies.

**Exam.** At 19:18: BP 122/73, HR 109, RR 20, T 98.9 F, SpO2 94%. Tachycardic, breathing with a deep pattern, comfortable at rest.

**Results.** On the 14:07 panel sodium 128, potassium 5.0, chloride 95, bicarbonate 8, anion gap 25, urea nitrogen 33, creatinine 1.15 (eGFR 58), glucose 205.

**Assessment and plan**

1. Wide anion gap acidosis with near-normal glucose, as above. The insulin infusion per DKA protocol at 0.1 units/kg/h has been running since 14:58, together with D5 lactated Ringer's at 150 mL/h, since glucose is near normal and we need to keep giving dextrose while insulin clears the ketones. <ref id="med_empagliflozin">Hold empagliflozin.</ref> Chemistry checks every 4 hours until the gap closes.
2. Diabetes: <ref id="med_metformin">hold metformin</ref> while acidotic and NPO. Glipizide and levothyroxine are on the continue list for now.
3. Sodium 128; recheck with the next panel as fluids run.
4. Creatinine 1.15; reassess with hydration.
5. Endocrinology to be asked to see the patient in the morning.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6563461",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-02-22T19:48:00Z",
    "admitted": "2024-02-23T00:14:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-02-23T01:18:00Z",
    "bp": { "systolic_mmhg": 122, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 109,
    "resp_rate_per_min": 20,
    "temp_f": 98.9,
    "spo2_pct": 94,
    "weight_kg": 86.4
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
    "accession": "L24053-6571",
    "collected": "2024-02-22T20:07:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "128",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "95",
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
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "33",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.15",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "58",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "205",
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
    "started": "2024-02-22T20:58:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2024-02-22T20:58:00Z"
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
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
