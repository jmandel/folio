---
folio: "0.1"
id: "01JZ5E7PX0DBVC4CM38JM2B2K1"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00628122"
effective: "2025-07-02T08:58:00Z"
recorded: "2025-07-02T11:27:00Z"
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

**Reason for admission:** community-acquired pneumonia.

**History of present illness.** The patient came to the ED last night with a cough and fever and has felt run down. Appetite has been poor. In the ED the white count was elevated, and intravenous fluids and antibiotics were started.

**Allergies:** NKDA.

**Exam.** Vitals at 03:48: BP 116/70, HR 112, RR 19, T 99 F, SpO2 98%. Mildly tachycardic with regular rhythm. Crackles at the lung bases, no increased work of breathing. Abdomen soft.

**Results.** BMP drawn 7/1 at 22:49: sodium 133 (L), potassium 4.6, chloride 106, bicarbonate 20 (L), anion gap 7, urea nitrogen 35 (H), creatinine 2.09 (H), eGFR 36 (L), glucose 120 (H).

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Admit, continue treatment started in the ED, and monitor oxygen saturation. Saline at 75 mL/h continues, running since 23:24.
2. <ref id="med_metformin">Hold metformin during the acute illness.</ref>
3. <ref id="med_empagliflozin">Hold empagliflozin while not eating.</ref>
4. Hypertension: continue amlodipine 5 mg daily.
5. Creatinine 2.09; repeat BMP in the morning.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6446313",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-07-02T03:34:00Z",
    "admitted": "2025-07-02T08:00:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-07-02T08:48:00Z",
    "bp": { "systolic_mmhg": 116, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 112,
    "resp_rate_per_min": 19,
    "temp_f": 99,
    "spo2_pct": 98,
    "weight_kg": 96.4
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
    "accession": "L25182-6305",
    "collected": "2025-07-02T03:49:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.6", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "106", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "7", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "35",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.09",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "36",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "120",
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
    "started": "2025-07-02T04:24:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
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
