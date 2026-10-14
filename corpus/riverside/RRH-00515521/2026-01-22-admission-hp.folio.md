---
folio: "0.1"
id: "01KFMGTHM0K0KNDVJMYDCMDXZW"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00515521"
effective: "2026-01-23T01:50:00Z"
recorded: "2026-01-23T04:12:00Z"
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

**Reason for admission:** <ref id="dx_pneumonia">community-acquired pneumonia</ref>.

**History of present illness.** The patient was seen in the ED this afternoon with several days of cough and feeling unwell, and was found to have a pneumonia on evaluation. The ED team started intravenous fluids at 15:24 because the morning labs showed a low sodium and reduced kidney function, and the patient is being admitted to the hospitalist service for further treatment and monitoring. The patient is comfortable on arrival to the floor and is taking sips of fluid.

**Allergies:** no known drug allergies.

**Exam.** Vitals at 19:40: BP 118/71, HR 84, RR 18, T 99 F, SpO2 97%. The patient is awake, conversant and in no distress. Breathing is unlabored at rest. Heart rhythm is regular. Abdomen is soft and nontender.

**Results.** The basic metabolic panel drawn at 14:52 shows sodium 130, potassium 4.5, chloride 100, bicarbonate 18, anion gap 12, urea nitrogen 50, creatinine 1.69 with an eGFR of 42, and glucose 117.

**Assessment and plan**

1. Community-acquired pneumonia: admit to the medical floor and continue treatment as started in the ED. Monitor temperature, respiratory rate and oxygen saturation, which are reassuring this evening.
2. Low sodium and elevated urea nitrogen and creatinine on the 14:52 panel: continue normal saline 0.9% at 75 mL/h, running since 15:24. Repeat the basic metabolic panel with the morning labs and follow the trend.
3. Low bicarbonate of 18 with a normal anion gap of 12: recheck on the morning panel.
4. Allergies reviewed: none known.

I will see the patient again in the morning.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6747190",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-01-22T20:34:00Z",
    "admitted": "2026-01-23T00:42:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-01-23T01:40:00Z",
    "bp": { "systolic_mmhg": 118, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 84,
    "resp_rate_per_min": 18,
    "temp_f": 99,
    "spo2_pct": 97,
    "weight_kg": 76
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L26022-3520",
    "collected": "2026-01-22T20:52:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.5", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "50",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.69",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "42",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "117",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "75 mL/h",
    "started": "2026-01-22T21:24:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
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
