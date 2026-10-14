---
folio: "0.1"
id: "01JPCGCHE0HSS3TGGCM7T94RHP"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00903997"
effective: "2025-03-15T07:12:00Z"
recorded: "2025-03-15T08:58:00Z"
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

**Reason for admission:** community-acquired pneumonia.

**History of present illness.** The patient came to the ED last evening with several days of cough, fevers at home, tiredness and chest discomfort on deep breaths. She was started on antibiotics in the department and transferred to the floor overnight. Allergy list: no known drug allergies.

**Home medications.** Losartan 50 mg daily, hydrochlorothiazide 25 mg daily and atorvastatin 20 mg nightly. Metformin 1000 mg twice daily with meals is also on her list.

**Exam.** Vitals at 02:02: BP 114/68, HR 99, RR 22, T 98.1 F, SpO2 99%. Looks tired but is conversational. Crackles at the lung base with a few scattered wheezes. Heart regular, abdomen soft, no leg swelling.

**Results.** The 22:42 panel showed sodium 133 (L), potassium 4.9, chloride 105, bicarbonate 20 (L), anion gap 8, urea nitrogen 33 (H), creatinine 0.91, eGFR 72 and glucose 136 (H). Normal saline has been running at 75 mL/h since 23:02.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Continue the antibiotic started in the ED, monitor oxygen saturation and respiratory rate, and encourage fluids and coughing. Continue IV saline for now given the low sodium and elevated urea nitrogen; repeat the metabolic panel in the morning.
2. <ref id="med_metformin">Metformin is held during the acute illness</ref>, to be resumed when she is able.
3. Continue losartan, hydrochlorothiazide and atorvastatin at the home doses.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6895131",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-03-15T03:12:00Z",
    "admitted": "2025-03-15T06:13:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-03-15T07:02:00Z",
    "bp": { "systolic_mmhg": 114, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 22,
    "temp_f": 98.1,
    "spo2_pct": 99,
    "weight_kg": 103.9
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
    "accession": "L25073-4954",
    "collected": "2025-03-15T03:42:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "133",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "33",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.91",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "72",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "136",
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
    "started": "2025-03-15T04:02:00Z"
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
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
