---
folio: "0.1"
id: "01JXSK9XB0R44N3SB3DKW0P32N"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00628122"
effective: "2025-06-15T08:28:00Z"
recorded: "2025-06-15T10:49:00Z"
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

**History of present illness.** The patient came to the ED last night feeling weak and washed out after several days of watery stools. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> The patient has eaten and drunk very little over that time. In the ED, potassium was 6.3 and creatinine 4.02, and calcium gluconate and intravenous saline were started.

**Allergies:** NKDA.

**Exam.** Vitals at 03:18: BP 110/66, HR 100, RR 23, T 98.2 F, SpO2 95%. Dry mucous membranes, mildly tachycardic with regular rhythm, lungs clear, abdomen soft without tenderness.

**Results.** BMP drawn 6/14 at 23:09: sodium 136, potassium 6.3 (HH), chloride 100, bicarbonate 17 (L), anion gap 19 (H), urea nitrogen 51 (H), creatinine 4.02 (H), eGFR 16 (L), glucose 185 (H).

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, prerenal from volume loss. Continue 0.9% saline, which has been running since 23:31 at 125 mL/h after the bolus. Repeat BMP this morning and daily.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.3, treated with calcium gluconate in the ED. Recheck potassium with the morning labs.
3. <ref id="med_lisinopril">Hold lisinopril until creatinine is back to baseline.</ref>
4. <ref id="med_metformin">Hold metformin during the acute illness.</ref>
5. <ref id="med_empagliflozin">Hold empagliflozin while not eating.</ref>
6. Hypertension: BP is soft-normal. Continue amlodipine 5 mg daily.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6086553",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-06-15T03:41:00Z",
    "admitted": "2025-06-15T07:18:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-06-15T08:18:00Z",
    "bp": { "systolic_mmhg": 110, "diastolic_mmhg": 66 },
    "heart_rate_bpm": 100,
    "resp_rate_per_min": 23,
    "temp_f": 98.2,
    "spo2_pct": 95,
    "weight_kg": 96.4
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
    "accession": "L25165-1883",
    "collected": "2025-06-15T04:09:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "17",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "51",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "4.02",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "16",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "185",
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
    "started": "2025-06-15T04:31:00Z"
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
  }
}
```
