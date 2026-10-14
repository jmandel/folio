---
folio: "0.1"
id: "01JPMQYC807NY5TKWDMC1Y553N"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00903997"
effective: "2025-03-18T12:42:00Z"
recorded: "2025-03-18T13:44:00Z"
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

**Interval.** She had a calmer night and says her breathing feels easier. Cough is less frequent. She is eating and walking in the hall.

**Exam.** Vitals at 07:22: BP 115/69, HR 79, RR 20, T 98 F, SpO2 95%. Comfortable, lungs with fewer crackles at the base.

**Results.** <ref id="bmp">The 06:17 panel shows sodium 135 (L), potassium 4.1, chloride 105, bicarbonate 21 (L), anion gap 9, urea nitrogen 27 (H), creatinine 0.85, eGFR 78 and glucose 115 (H).</ref>

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, improving, with a heart rate back to the 70s. Continue current care and monitoring.
2. Sodium and bicarbonate are mildly low and urea nitrogen is still 27; kidney function is stable. Keep encouraging oral fluids and recheck tomorrow.
3. Metformin remains held. Continue losartan, hydrochlorothiazide and atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6895131",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-03-15T03:12:00Z",
    "admitted": "2025-03-15T06:13:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-03-18T12:22:00Z",
    "bp": { "systolic_mmhg": 115, "diastolic_mmhg": 69 },
    "heart_rate_bpm": 79,
    "resp_rate_per_min": 20,
    "temp_f": 98,
    "spo2_pct": 95,
    "weight_kg": 103.9
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
    "accession": "L25077-4477",
    "collected": "2025-03-18T11:17:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.1", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "27",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.85",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "78",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "115",
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
    "started": "2025-03-15T04:02:00Z",
    "stopped": "2025-03-16T06:13:00Z"
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
    "status": "held"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
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
