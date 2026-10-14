---
folio: "0.1"
id: "01J8S6F350ZHCJCMGRM5ZQSS4Q"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00357349"
effective: "2024-09-27T05:53:00Z"
recorded: "2024-09-27T07:35:00Z"
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

**History of present illness.** The patient was seen in the ED this evening after several days of productive cough, low-grade fever and tiredness, with some breathlessness on exertion. Intake has been poor over the past few days. The ED team started ceftriaxone and normal saline at 75 mL/h, which is still running. There is no known drug allergy (NKDA).

**Exam.** Vitals at 00:43: BP 130/78, HR 92, RR 24, T 98.4 F, SpO2 97%. The patient is awake, conversant and mildly tachypneic but not in distress. Crackles are present at the right base. Heart sounds are regular. Abdomen is soft. Mucous membranes are slightly dry.

**Results.** The basic metabolic panel drawn 9/26 at 18:49 showed sodium 131 (L), potassium 4.8, chloride 97 (L), bicarbonate 20 (L), anion gap 14, urea nitrogen 47 (H), creatinine 1.17 (H), eGFR 46 (L) and glucose 129 (H).

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Continue ceftriaxone and monitor temperature, respiratory rate and oxygen saturation overnight. Reassess with the morning labs.
2. Volume depletion with mildly low sodium and raised urea nitrogen and creatinine. Continue normal saline and repeat the chemistry panel in the morning.
3. Hypertension: blood pressure is acceptable. <ref id="med_losartan">Hold losartan until creatinine is back to baseline.</ref>
4. Diabetes: <ref id="med_metformin">Hold metformin during the acute illness.</ref> Glucose was 129 on arrival.
5. Disposition: admit to the medical floor. The patient and family were updated on the plan.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6327873",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-09-26T23:20:00Z",
    "admitted": "2024-09-27T04:46:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-09-27T05:43:00Z",
    "bp": { "systolic_mmhg": 130, "diastolic_mmhg": 78 },
    "heart_rate_bpm": 92,
    "resp_rate_per_min": 24,
    "temp_f": 98.4,
    "spo2_pct": 97,
    "weight_kg": 78.5
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
    "accession": "L24270-5960",
    "collected": "2024-09-26T23:49:00Z",
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
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "97",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "47",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.17",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "46",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "129",
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
    "started": "2024-09-27T00:10:00Z"
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
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold until creatinine back to baseline"
  }
}
```
