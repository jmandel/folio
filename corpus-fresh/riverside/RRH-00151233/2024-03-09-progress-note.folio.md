---
folio: "0.1"
id: "01HRHVW1R0EV4GQXM2GXHFQNWJ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00151233"
effective: "2024-03-09T13:35:00Z"
recorded: "2024-03-09T15:04:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval events.** The patient slept well overnight and feels stronger today. Diarrhea has settled. The saline infusion was stopped at 02:43. No chest pain, palpitations or shortness of breath.

**Exam.** Vitals at 07:15: BP 123/74, HR 79, RR 17, T 99 F, SpO2 96%. Comfortable and alert. Regular rhythm, lungs clear, abdomen soft, mucous membranes moist.

**Results.** <ref id="bmp">On the 06:00 panel sodium is 135 (L), potassium 5.7 (H), chloride 105, bicarbonate 21 (L), anion gap 9, urea nitrogen 19, creatinine 1.67 (H), eGFR 47 (L) and glucose 133 (H).</ref>

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref> is improving: creatinine has come down from 2.21 on admission to 1.67 after fluids, and urea nitrogen has fallen to 19. Recheck a basic metabolic panel tomorrow morning. Lisinopril remains held.
2. Potassium is better than on arrival but still 5.7. Repeat with tomorrow's panel.
3. Sodium has corrected to 135 with fluids.
4. Hypertension: blood pressure is acceptable. Continue amlodipine 5 mg daily.
5. Continue atorvastatin 40 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6752574",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-03-08T04:55:00Z",
    "admitted": "2024-03-08T08:43:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-03-09T13:15:00Z",
    "bp": { "systolic_mmhg": 123, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 79,
    "resp_rate_per_min": 17,
    "temp_f": 99,
    "spo2_pct": 96,
    "weight_kg": 80.9
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24069-8803",
    "collected": "2024-03-09T12:00:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.7",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "19", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.67",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "47",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "133",
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
    "started": "2024-03-08T05:45:00Z",
    "stopped": "2024-03-09T08:43:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
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
