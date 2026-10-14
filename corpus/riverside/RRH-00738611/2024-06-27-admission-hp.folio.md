---
folio: "0.1"
id: "01J1CH7B50C6DC7W67T9AYTVX0"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00738611"
effective: "2024-06-27T07:27:00Z"
recorded: "2024-06-27T09:43:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient was seen in the ED on the evening of 6/26 after several days of watery diarrhea, with weakness and poor intake. <ref id="precipitant">The AKI is attributed to volume depletion from four days of diarrhea while the patient kept taking the ARB and diuretic.</ref> No chest pain, palpitations or fainting. Labs in the ED showed sodium 129, potassium 6.8, bicarbonate 18, urea nitrogen 59, creatinine 1.90 and eGFR 28. Calcium gluconate was given, and saline was started at 21:38 as a 1000 mL bolus followed by 125 mL/h; it is still running.

**Medications at home:** metformin 500 mg twice daily with meals, losartan 100 mg daily, amlodipine 5 mg daily, atorvastatin 20 mg nightly.

**Allergies:** no known drug allergies.

**Exam.** At 02:17: BP 125/75, HR 84, RR 24, T 98.2 F, SpO2 96%. Comfortable, alert, mildly dry mucous membranes. Regular rhythm, clear lungs, soft abdomen.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, prerenal in the setting of diarrhea. Continue saline at 125 mL/h and repeat the BMP in the morning. <ref id="med_losartan">Hold losartan until creatinine is back to baseline.</ref>
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.8 on arrival, treated with calcium gluconate in the ED. Repeat potassium with the next panel and keep the patient on monitoring.
3. Diabetes: <ref id="med_metformin">hold metformin during the acute illness.</ref>
4. Hypertension: continue amlodipine.
5. Continue atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6053459",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-06-27T01:48:00Z",
    "admitted": "2024-06-27T06:24:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-06-27T07:17:00Z",
    "bp": { "systolic_mmhg": 125, "diastolic_mmhg": 75 },
    "heart_rate_bpm": 84,
    "resp_rate_per_min": 24,
    "temp_f": 98.2,
    "spo2_pct": 96,
    "weight_kg": 90.5
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
    "accession": "L24178-6142",
    "collected": "2024-06-27T02:03:00Z",
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
        "value": "6.8",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "59",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.90",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "28",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "146",
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
    "started": "2024-06-27T02:38:00Z"
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
  }
}
```
