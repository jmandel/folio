---
folio: "0.1"
id: "01KD5TWT8093XTFTC57BK0C07A"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00324781"
effective: "2025-12-23T13:52:00Z"
recorded: "2025-12-23T14:48:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval.** The patient feels much better, is eating, and the diarrhea has stopped. The saline was stopped at 20:23 last evening.

**Exam.** Vitals at 07:32: BP 136/82, HR 90, RR 19, temperature 98.5 F, SpO2 94%. Comfortable at rest. Lungs clear, abdomen soft and nontender.

**Results.** <ref id="bmp">On the 06:01 panel: sodium 134, potassium 5.6, chloride 104, bicarbonate 24, anion gap 6, urea nitrogen 30, creatinine 1.25, eGFR 46, glucose 159.</ref> Potassium has come down from 6.2 yesterday.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref> continues to improve off IV fluids, creatinine 1.25 and falling from 1.47.
2. Potassium is better but still mildly high at 5.6; repeat tomorrow.
3. Lisinopril and metformin remain held.
4. Continue atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6577647",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-12-21T22:12:00Z",
    "admitted": "2025-12-22T02:23:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-12-23T13:32:00Z",
    "bp": { "systolic_mmhg": 136, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 90,
    "resp_rate_per_min": 19,
    "temp_f": 98.5,
    "spo2_pct": 94,
    "weight_kg": 86.1
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
    "accession": "L25357-4505",
    "collected": "2025-12-23T12:01:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "134",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.6",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "6",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.25",
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
        "value": "159",
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
    "started": "2025-12-21T23:02:00Z",
    "stopped": "2025-12-23T02:23:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "held"
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
