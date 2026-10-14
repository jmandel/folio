---
folio: "0.1"
id: "01K4XWZMZ0GHZV3NMYMP4TPSGB"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00227445"
effective: "2025-09-12T00:52:00Z"
recorded: "2025-09-12T02:45:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>.

**History of present illness.** The patient presented to the ED this afternoon feeling weak and unwell, with nausea, abdominal discomfort and rapid breathing. <ref id="precipitant">The ketoacidosis was precipitated by influenza with fever and poor oral intake.</ref> Over the past several days they have eaten and drunk very little. Initial labs showed a wide anion gap acidosis with a glucose of only 186, which fits the euglycemic picture. They take <ref id="med_empagliflozin">empagliflozin 10 mg daily, which is held</ref>.

**Allergies:** no known drug allergies.

**Home medications.** <ref id="med_metformin">Metformin 500 mg twice daily with meals is held</ref> while acidotic and NPO. <ref id="med_hydrochlorothiazide">Hydrochlorothiazide 25 mg daily is held</ref> for volume depletion. <ref id="med_lisinopril">Lisinopril 20 mg daily is continued.</ref> Levothyroxine 75 mcg daily is continued.

**Exam.** On the 19:42 vitals BP 121/73, HR 89, RR 18, temperature 98.5 F, SpO2 97%. Mucous membranes are dry. Breathing is mildly deep but unlabored. Abdomen is soft.

**Results.** The 15:24 panel: sodium 129, potassium 4.7, chloride 92, bicarbonate 14, anion gap 23, urea nitrogen 27, creatinine 1.22, eGFR 52, glucose 186. Lipase 45.

**Assessment and plan**

1. Euglycemic DKA as above. The insulin infusion per DKA protocol at 0.1 units/kg/h was started at 16:15 and continues, together with D5 lactated Ringer's at 150 mL/h, since glucose is near normal. Check chemistries regularly while on the infusion and continue until the gap closes. Empagliflozin stays on hold.
2. <ref id="dx_pancreatitis">Pancreatitis ruled out</ref>: lipase 45 and no persistent pain.
3. Hyponatremia, sodium 129, most likely from volume loss. Recheck with the next panel as fluids run.
4. Creatinine 1.22 with eGFR 52, likely prerenal from poor intake. Follow with fluids.
5. Hypothyroidism: continue levothyroxine.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6926554",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-09-11T20:05:00Z",
    "admitted": "2025-09-12T00:02:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-09-12T00:42:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 89,
    "resp_rate_per_min": 18,
    "temp_f": 98.5,
    "spo2_pct": 97,
    "weight_kg": 83.9
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
    "accession": "L25254-3658",
    "collected": "2025-09-11T20:24:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "45",
    "unit": "U/L",
    "ref_range": "13-60"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25254-0743",
    "collected": "2025-09-11T20:24:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "129",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.7", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "92",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "14",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
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
        "value": "1.22",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "52",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "186",
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
    "started": "2025-09-11T21:15:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2025-09-11T21:15:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
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
  },
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
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
