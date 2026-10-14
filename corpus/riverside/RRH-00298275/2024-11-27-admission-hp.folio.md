---
folio: "0.1"
id: "01JDPH9K70XC0DVTRCPCWQZYMB"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00298275"
effective: "2024-11-27T08:12:00Z"
recorded: "2024-11-27T10:05:00Z"
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

**Reason for admission:** pneumonia.

**History of present illness.** The patient was seen in the ED on the evening of 11/26 after several days of cough, fever and tiredness with shortness of breath on exertion. She has been eating and drinking poorly over that time. She has no chest pain, no vomiting and no known drug allergies. She is admitted for treatment of <ref id="dx_pneumonia">community-acquired pneumonia</ref>.

**Home medications.** Metformin, empagliflozin, dulaglutide, insulin glargine, lisinopril, amlodipine and atorvastatin, plus one other daily medication that continues unchanged. Reconciliation is below.

**Exam.** Vitals at 02:02: BP 112/67, HR 78, RR 22, T 98.1 F, SpO2 95%. She is comfortable at rest but breathes a little faster than normal. Crackles are heard at the right base. Heart sounds are regular. Abdomen is soft. No leg swelling.

**Results.** The basic metabolic panel from 11/26 20:27 showed sodium 137, potassium 4.8, chloride 101, bicarbonate 18 (low), anion gap 18 (high), urea nitrogen 38 (high), creatinine 2.11 (high), eGFR 38 and glucose 121. Normal saline at 75 mL/h has been running since 21:02.

**Assessment and plan**

1. Community-acquired pneumonia, as above, with monitoring of her breathing and oxygen saturation overnight.
2. Abnormal chemistry with a low bicarbonate, raised anion gap and elevated creatinine; continue saline at 75 mL/h and repeat the panel with morning labs.
3. <ref id="med_metformin">Hold metformin during the acute illness</ref>; plan to resume when able.
4. <ref id="med_empagliflozin">Hold empagliflozin while she is not eating</ref>; plan to resume when able.
5. Continue dulaglutide, insulin glargine 14 units nightly, lisinopril, amlodipine and atorvastatin, and her other daily home medication, at home doses.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6138496",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-27T02:12:00Z",
    "admitted": "2024-11-27T07:16:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-11-27T08:02:00Z",
    "bp": { "systolic_mmhg": 112, "diastolic_mmhg": 67 },
    "heart_rate_bpm": 78,
    "resp_rate_per_min": 22,
    "temp_f": 98.1,
    "spo2_pct": 95,
    "weight_kg": 96.8
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
    "accession": "L24331-3562",
    "collected": "2024-11-27T02:27:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.8", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "38",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.11",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "38",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "121",
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
    "started": "2024-11-27T03:02:00Z"
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
    "dose_text": "14 units",
    "sig": "14 units SubQ nightly",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
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
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
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
