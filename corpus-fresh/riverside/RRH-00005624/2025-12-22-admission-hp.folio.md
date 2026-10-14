---
folio: "0.1"
id: "01KD4T7970MJHM0N06ZSX1G6A4"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00005624"
effective: "2025-12-23T03:07:00Z"
recorded: "2025-12-23T05:17:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient was seen in the ED today with several days of watery diarrhea and poor intake, feeling weak and lightheaded on standing. Over those days they kept taking their usual blood pressure pills and diabetes medicines. In the ED the basic metabolic panel drawn at 14:23 showed sodium 129, potassium 6.0, bicarbonate 16, urea nitrogen 38 and creatinine 5.44 (eGFR 12). They received calcium gluconate 1 g IV and a saline bolus, and the saline continues at 125 mL/h, started 14:45.

**Allergies:** no known drug allergies.

**Exam.** Vitals at 20:57: BP 113/68, HR 96, RR 20, T 99.1 F, SpO2 99%. Comfortable, mildly dry mucous membranes, lungs clear, abdomen soft and non-tender.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, <ref id="precipitant">attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic</ref>. Continue isotonic saline at 125 mL/h, strict intake and output, and repeat BMP in the morning. Avoid nephrotoxins.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.0 on arrival and treated with calcium in the ED. Recheck potassium on the morning panel and continue cardiac monitoring.
3. <ref id="med_losartan">Hold losartan</ref> until creatinine is back to baseline.
4. <ref id="med_chlorthalidone">Hold chlorthalidone</ref> for volume depletion.
5. <ref id="med_metformin">Hold metformin</ref> during the acute illness.
6. <ref id="med_dapagliflozin">Hold dapagliflozin</ref> while not eating.
7. Hypertension: BP is acceptable tonight. Continue amlodipine.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6114021",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-12-22T19:55:00Z",
    "admitted": "2025-12-23T02:14:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-12-23T02:57:00Z",
    "bp": { "systolic_mmhg": 113, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 96,
    "resp_rate_per_min": 20,
    "temp_f": 99.1,
    "spo2_pct": 99,
    "weight_kg": 100
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "dx_hyperk": {
    "type": "diagnosis",
    "label": "Hyperkalemia",
    "icd10cm": "E87.5",
    "status": "active",
    "rank": "secondary"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25356-8900",
    "collected": "2025-12-22T20:23:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.0",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "16",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "38",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "5.44",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "12",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "154",
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
    "dose_text": "1000 mL bolus, then 125 mL/h",
    "started": "2025-12-22T20:45:00Z"
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
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "Hold for volume depletion"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
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
