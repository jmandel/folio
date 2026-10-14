---
folio: "0.1"
id: "01H7YA22W069K4EN4KWX7WRXDT"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00652687"
effective: "2023-08-16T03:01:00Z"
recorded: "2023-08-16T04:36:00Z"
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

**Reason for admission:** <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>.

**History of present illness.** The patient presented to the ED this afternoon feeling unwell, with nausea, malaise and fatigue, and was found to be markedly acidotic with a near-normal glucose. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery.

**Allergies:** no known drug allergies.

**Exam.** At 21:51: BP 107/64, HR 94, RR 16, T 98.9 F, SpO2 99%. Comfortable at rest on the insulin infusion, with no distress. Abdomen soft and nontender.

**Results.** The 15:00 basic metabolic panel showed sodium 130, potassium 5.6, chloride 97, bicarbonate 9, anion gap 24, urea nitrogen 31, creatinine 1.93 (eGFR 29) and glucose 184.

**Assessment and plan**

1. Euglycemic DKA with a wide anion gap acidosis. The insulin infusion per DKA protocol at 0.1 units/kg/h was started 15:51 and continues, together with D5 lactated Ringer's at 150 mL/h, since glucose is near normal. Recheck the metabolic panel serially until the gap closes. <ref id="med_empagliflozin">Hold empagliflozin.</ref>
2. Diabetes: <ref id="med_metformin">hold metformin</ref> while acidotic and NPO.
3. Hypertension and kidney function: creatinine 1.93 with potassium 5.6. <ref id="med_losartan">Hold losartan</ref> for volume depletion and potassium; resume when eating. Avoid nephrotoxins.
4. Hyponatremia, sodium 130, likely from volume depletion; expect improvement with fluids.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6337771",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-08-15T19:41:00Z",
    "admitted": "2023-08-16T01:48:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-08-16T02:51:00Z",
    "bp": { "systolic_mmhg": 107, "diastolic_mmhg": 64 },
    "heart_rate_bpm": 94,
    "resp_rate_per_min": 16,
    "temp_f": 98.9,
    "spo2_pct": 99,
    "weight_kg": 83.2
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
    "accession": "L23227-2467",
    "collected": "2023-08-15T20:00:00Z",
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
        "value": "5.6",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "97",
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
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "31",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.93",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "29",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "184",
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
    "started": "2023-08-15T20:51:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2023-08-15T20:51:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold for volume depletion and potassium; resume when eating"
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
