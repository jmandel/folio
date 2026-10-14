---
folio: "0.1"
id: "01KMQS7AS0VWV7VDMBMSY9ZJC4"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00949795"
effective: "2026-03-27T12:57:00Z"
recorded: "2026-03-27T13:55:00Z"
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

**Interval.** Slept reasonably overnight. Cough persists but he feels somewhat better than on arrival. Allergies: NKDA.

**Exam.** Vitals at 07:37: BP 120/72, HR 101, RR 22, T 99 F, SpO2 98%. Looks comfortable. Crackles persist at the lung base. Heart rate remains mildly fast.

**Results.** <ref id="bmp">The 06:16 panel showed sodium 138, potassium 4.0, chloride 102, bicarbonate 23, anion gap 13, urea nitrogen 25 (H), creatinine 1.60 (H), eGFR 35 (L) and glucose 127 (H)</ref>. Urea nitrogen has fallen from 54 and bicarbonate has normalized; creatinine is improving slowly.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>: improving clinically, with stable oxygen saturation. Continue current treatment and monitoring.
2. Reduced kidney function with dehydration: improving with fluids. Normal saline at 75 mL/h continues. Recheck the panel tomorrow morning.
3. Metformin and empagliflozin remain held.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6532872",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-03-26T22:55:00Z",
    "admitted": "2026-03-27T04:36:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-03-27T12:37:00Z",
    "bp": { "systolic_mmhg": 120, "diastolic_mmhg": 72 },
    "heart_rate_bpm": 101,
    "resp_rate_per_min": 22,
    "temp_f": 99,
    "spo2_pct": 98,
    "weight_kg": 70.5
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
    "accession": "L26086-4565",
    "collected": "2026-03-27T11:16:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "13", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "25",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.60",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "35",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "127",
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
    "started": "2026-03-26T23:45:00Z"
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
    "status": "held"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  }
}
```
