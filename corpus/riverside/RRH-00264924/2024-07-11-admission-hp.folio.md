---
folio: "0.1"
id: "01J2JRA4J04YD7P384RXRG3GYZ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00264924"
effective: "2024-07-12T04:18:00Z"
recorded: "2024-07-12T05:58:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient was sent up from the ED after labs drawn at 17:00 showed a potassium of 6.7 and a creatinine of 2.02. They have had back pain for several days and have been treating it with over-the-counter naproxen. They have also been drinking very little. In the ED they received IV calcium and a saline bolus, and saline is still running at 125 mL/h.

**Past medical history.** Hypertension, hypothyroidism and hyperlipidemia, managed with the home medications below.

**Home medications.** Lisinopril 10 mg daily, amlodipine 5 mg daily, atorvastatin 40 mg nightly, levothyroxine 75 mcg daily.

**Allergies:** no known drug allergies.

**Exam.** At 23:08: BP 126/76, HR 88, RR 23, temperature 98.8 F, SpO2 94%. Comfortable at rest, mucous membranes slightly dry. Lungs clear, abdomen soft.

**Results.** BMP at 17:00: sodium 136, potassium 6.7, chloride 103, bicarbonate 19, anion gap 14, urea nitrogen 48, creatinine 2.02, eGFR 39, glucose 163.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake.</ref> Continue normal saline at 125 mL/h and recheck a BMP in the morning. Avoid further NSAIDs.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.7 at presentation, treated with calcium in the ED. Repeat potassium with the morning panel.
3. Hypertension: <ref id="med_lisinopril">Hold lisinopril until creatinine is back to baseline.</ref> Continue amlodipine.
4. Hyperlipidemia: continue atorvastatin.
5. Hypothyroidism: continue levothyroxine.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6553794",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-07-11T21:34:00Z",
    "admitted": "2024-07-12T03:12:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-07-12T04:08:00Z",
    "bp": { "systolic_mmhg": 126, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 88,
    "resp_rate_per_min": 23,
    "temp_f": 98.8,
    "spo2_pct": 94,
    "weight_kg": 80.8
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
    "accession": "L24193-9664",
    "collected": "2024-07-11T22:00:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.7",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "48",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.02",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "39",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "163",
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
    "started": "2024-07-11T22:24:00Z"
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
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
