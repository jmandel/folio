---
folio: "0.1"
id: "01GXW24CT0Z9184QB95HKN0R8H"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00425415"
effective: "2023-04-10T06:36:00Z"
effective_end: "2023-04-12T20:30:00Z"
recorded: "2023-04-13T01:02:00Z"
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

**Diagnoses.** <ref id="dx_aki">Acute kidney injury, resolved.</ref> Hyperkalemia, resolved.

**Hospital course.** The patient was admitted with weakness and lightheadedness after four days of diarrhea. On arrival the potassium was 6.1 and the creatinine 2.55. <ref id="precipitant">The kidney injury was attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> The patient received calcium gluconate in the ED and was treated with intravenous normal saline, a 1000 mL bolus followed by 125 mL/h, which was stopped on 4/11 at 01:36. The diarrhea settled, appetite returned, and the kidney function and potassium improved steadily over the stay.

**Condition at discharge.** Vitals: BP 123/74, HR 81, RR 16, T 98.2 F, SpO2 95%. The patient feels well, is eating and drinking normally, and is walking without lightheadedness.

**Results at discharge.** The basic metabolic panel drawn 4/12 at 06:21 showed sodium 136, potassium 4.7, chloride 99, bicarbonate 25, anion gap 12, urea nitrogen 29 (H), creatinine 1.41 (H), eGFR 65 and glucose 151 (H). Potassium is now normal and creatinine is much improved from 2.55 on admission.

**Allergies:** NKDA.

**Discharge medications**

- Rosuvastatin 20 mg tablet, 1 tablet by mouth nightly (continue).
- The blood pressure medicines held during this illness remain held until the follow-up visit below.

**Follow-up.** Primary care (Northgate Family Medicine) within 1 week. Repeat basic metabolic panel at that visit, and decide on restarting the held blood pressure medicines. The patient was advised to keep drinking fluids and to call if the diarrhea returns or urine output falls.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6413280",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-04-10T01:55:00Z",
    "admitted": "2023-04-10T06:36:00Z",
    "discharged": "2023-04-12T20:30:00Z",
    "disposition": "home"
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "resolved",
    "rank": "principal"
  },
  "dx_hyperk": {
    "type": "diagnosis",
    "label": "Hyperkalemia",
    "icd10cm": "E87.5",
    "status": "resolved",
    "rank": "secondary"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-04-12T17:30:00Z",
    "bp": { "systolic_mmhg": 123, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 81,
    "resp_rate_per_min": 16,
    "temp_f": 98.2,
    "spo2_pct": 95,
    "weight_kg": 101.3
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23102-5877",
    "collected": "2023-04-12T11:21:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.7", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "29",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.41",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "65",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "151",
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
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
