---
folio: "0.1"
id: "01KGETFH30YYDCWE0M9D1G0GKB"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00346827"
effective: "2026-02-02T07:46:00Z"
recorded: "2026-02-02T09:21:00Z"
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

**Reason for admission:** <ref id="dx_pneumonia">community-acquired pneumonia</ref>.

**History of present illness.** The patient was seen in the ED this evening with cough, fever and shortness of breath, and was found to have pneumonia on chest imaging. Appetite has been poor over the last few days. Creatinine in the ED was higher than expected and bicarbonate was low, and intravenous fluids were started.

**Allergies:** NKDA.

**Exam.** Vitals at 01:36: BP 115/69, HR 91, RR 19, T 99.2 F, SpO2 95%. The patient is comfortable at rest. Crackles are present at the lung base, the heart is regular, and the abdomen is soft.

**Results.** Basic metabolic panel drawn 2/1 at 19:03: sodium 135 (L), potassium 4.8, chloride 106, bicarbonate 17 (L), anion gap 12, urea nitrogen 31 (H), creatinine 2.07 (H), eGFR 34 (L), glucose 170 (H).

**Assessment and plan**

1. Community-acquired pneumonia: continue treatment as started in the ED and monitor oxygen saturation and respiratory rate.
2. Reduced kidney function with low bicarbonate: sodium chloride 0.9% continues at 75 mL/h, started 19:24. Repeat the chemistry panel in the morning.
3. Diabetes medications: <ref id="med_metformin">hold metformin</ref> during the acute illness, and <ref id="med_empagliflozin">hold empagliflozin</ref> while the patient is not eating. Both can be resumed when able.
4. Blood pressure: continue losartan and amlodipine at home doses; BP is 115/69.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6700193",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-02-02T00:34:00Z",
    "admitted": "2026-02-02T06:26:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-02-02T07:36:00Z",
    "bp": { "systolic_mmhg": 115, "diastolic_mmhg": 69 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 19,
    "temp_f": 99.2,
    "spo2_pct": 95,
    "weight_kg": 75.1
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
    "accession": "L26032-7917",
    "collected": "2026-02-02T01:03:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "135",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.8", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "106", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "17",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "31",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.07",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "34",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "170",
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
    "started": "2026-02-02T01:24:00Z"
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
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while not eating"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
