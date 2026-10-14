---
folio: "0.1"
id: "01JY8WN3306HYK1PQ0DWX7YKTP"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00000354"
effective: "2025-06-21T07:36:00Z"
recorded: "2025-06-21T09:21:00Z"
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

**Reason for admission:** pneumonia with reduced kidney function.

**History of present illness.** The patient was seen in the ED last evening with several days of cough, fever and tiredness, and was started on IV antibiotics and IV saline. Overnight they are comfortable and breathing without distress. No known drug allergies.

**Exam.** Vitals at 02:26: BP 118/71, HR 79, RR 18, T 99.1 F, SpO2 94%. Comfortable at rest. Crackles at the lung base. Heart regular. Abdomen soft.

**Results.** Basic metabolic panel drawn at 20:08: sodium 133 (L), potassium 4.3, chloride 99, bicarbonate 22, anion gap 12, urea nitrogen 30 (H), creatinine 1.89 (H), eGFR 30 (L), glucose 152 (H).

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Continue antibiotics and monitor oxygenation.
2. Creatinine 1.89 with low sodium. Continue normal saline at 75 mL/h, started 20:24. Repeat the metabolic panel in the morning.
3. Home medications: <ref id="med_losartan">hold losartan 100 mg daily until creatinine is back to baseline</ref>. <ref id="med_metformin">Hold metformin 1000 mg twice daily during the acute illness</ref>. <ref id="med_dapagliflozin">Hold dapagliflozin 10 mg daily while the patient is not eating</ref>. Each will be resumed when able. Continue dulaglutide 0.5 mg weekly, chlorthalidone 12.5 mg daily and atorvastatin 40 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6753669",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-06-21T00:34:00Z",
    "admitted": "2025-06-21T06:24:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-06-21T07:26:00Z",
    "bp": { "systolic_mmhg": 118, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 79,
    "resp_rate_per_min": 18,
    "temp_f": 99.1,
    "spo2_pct": 94,
    "weight_kg": 59.1
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
    "accession": "L25171-2020",
    "collected": "2025-06-21T01:08:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.89",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "30",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "152",
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
    "started": "2025-06-21T01:24:00Z"
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
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while not eating"
  },
  "med_dulaglutide": {
    "type": "home_med",
    "drug_name": "dulaglutide pen",
    "rxnorm_ingredient": "1551291",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold until creatinine back to baseline"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
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
