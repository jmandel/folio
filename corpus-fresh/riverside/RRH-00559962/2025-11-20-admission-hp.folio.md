---
folio: "0.1"
id: "01KAG8KPB074001CX48KVCKKVH"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00559962"
effective: "2025-11-20T07:02:00Z"
recorded: "2025-11-20T09:13:00Z"
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

**Reason for admission:** community-acquired pneumonia with volume depletion.

**History of present illness.** The patient was seen in the ED earlier this evening with cough, malaise and some shortness of breath after several days of reduced eating and drinking. Workup in the ED showed a raised white count and a chest exam with focal crackles. Ceftriaxone was started at 21:50 and normal saline at 75 mL/h at 21:10, which is still running.

**Home medications.** Dulaglutide 0.5 mg weekly, insulin glargine 10 units nightly, lisinopril 40 mg daily, chlorthalidone 12.5 mg daily, amlodipine 5 mg daily and atorvastatin 40 mg nightly are continued. The other two home medications are addressed below.

**Allergies:** NKDA.

**Exam.** Vitals at 00:52: BP 119/71, HR 109, RR 24, T 98.7 F, SpO2 99%. The patient is tired but conversant and mildly tachypneic. Crackles persist at the base of one lung. Mucous membranes are slightly dry. Abdomen soft.

**Results.** Basic metabolic panel from 20:48: sodium 131 (L), potassium 4.8, chloride 102, bicarbonate 21 (L), anion gap 8, urea nitrogen 58 (H), creatinine 1.49 (H), eGFR 40 (L), glucose 171 (H).

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Continue ceftriaxone 1 g IV every 24 hours. Monitor respiratory rate and oxygen saturation overnight, given the tachycardia and the respiratory rate of 24.
2. Low sodium and elevated urea nitrogen and creatinine, consistent with dehydration. Continue normal saline and recheck the panel this morning. Avoid nephrotoxins.
3. Diabetes: <ref id="med_metformin">hold metformin during the acute illness</ref> and <ref id="med_dapagliflozin">hold dapagliflozin while the patient is not eating</ref>. Both can be resumed when able. Continue dulaglutide and glargine; check fingerstick glucose with meals.
4. Hypertension: BP is acceptable on the current regimen, which is continued.
5. Continue atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6377385",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-11-20T02:20:00Z",
    "admitted": "2025-11-20T05:59:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-11-20T06:52:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 109,
    "resp_rate_per_min": 24,
    "temp_f": 98.7,
    "spo2_pct": 99,
    "weight_kg": 66.6
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
    "accession": "L25323-0812",
    "collected": "2025-11-20T02:48:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "131",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.8", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "58",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.49",
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
        "value": "171",
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
    "started": "2025-11-20T03:10:00Z"
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
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
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
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 100 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
