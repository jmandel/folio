---
folio: "0.1"
id: "01J69P5820ECZSWCP9GCKEH9KM"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00326340"
effective: "2024-08-27T08:43:00Z"
recorded: "2024-08-27T10:30:00Z"
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

**Reason for admission:** pneumonia with low sodium.

**History of present illness.** The patient was seen in the ED last evening with several days of cough, tiredness and breathlessness on exertion. Evaluation there led to the diagnosis below, and the patient was admitted for intravenous treatment and fluids. Normal saline has been running at 75 mL/h since 21:31.

**Allergies:** no known drug allergies.

**Home medications.** Metformin 1000 mg twice daily with meals, losartan 50 mg daily, hydrochlorothiazide 25 mg daily and atorvastatin 40 mg nightly.

**Exam.** Vitals at 03:33: BP 107/64, HR 99, RR 17, T 98.2 F, SpO2 98%. Comfortable at rest and asleep when I arrived, easily woken. Crackles at one lung base, no wheeze. Heart regular. Abdomen soft. No leg swelling.

**Results.** Basic metabolic panel drawn at 21:13: sodium 129 (L), potassium 4.4, chloride 104, bicarbonate 20 (L), anion gap 5 (L), urea nitrogen 42 (H), creatinine 1.39 (H), eGFR 40 (L), glucose 145 (H).

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Continue the antibiotic started in the ED and the IV fluids. Monitor oxygen saturation and temperature through the day.
2. Hyponatremia, sodium 129, with urea nitrogen and creatinine above normal, most likely from poor intake and volume loss during the illness. Continue saline and repeat the panel in the morning.
3. Diabetes: <ref id="med_metformin">hold metformin during the acute illness</ref>, to be resumed when able.
4. Hypertension: continue losartan and hydrochlorothiazide. Blood pressure is soft-normal, so we will recheck it with the morning labs.
5. Continue atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6796761",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-08-27T01:41:00Z",
    "admitted": "2024-08-27T07:31:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-08-27T08:33:00Z",
    "bp": { "systolic_mmhg": 107, "diastolic_mmhg": 64 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 17,
    "temp_f": 98.2,
    "spo2_pct": 98,
    "weight_kg": 96.7
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
    "accession": "L24239-2959",
    "collected": "2024-08-27T02:13:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "5",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "42",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.39",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "40",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "145",
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
    "started": "2024-08-27T02:31:00Z"
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
    "instructions": "Hold during acute illness"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
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
