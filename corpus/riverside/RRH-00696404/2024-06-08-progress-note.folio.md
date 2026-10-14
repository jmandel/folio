---
folio: "0.1"
id: "01HZW17MW01XRH8RJ9VQP4ZPZ1"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00696404"
effective: "2024-06-08T12:45:00Z"
recorded: "2024-06-08T13:40:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval history.** Overnight the patient had no complaints and felt less tired this morning. Normal saline at 125 mL/h continues to run. No known drug allergies.

**Exam.** Vitals at 07:25: BP 128/77, HR 100, RR 20, T 98.6 F, SpO2 95%. Heart rate remains at the upper end. Comfortable, lungs clear.

**Results.** <ref id="bmp">The 06:05 panel showed sodium 138, potassium 5.9 (H), chloride 105, bicarbonate 23, anion gap 10, urea nitrogen 24 (H), creatinine 1.73 (H), eGFR 37 (L) and glucose 133 (H).</ref> The acidosis has cleared and the anion gap is normal. Potassium is better than on admission but still high.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, improving: creatinine 1.73 from 2.08 on admission, with urea nitrogen down from 59 to 24. Continue normal saline at 125 mL/h and repeat the BMP in the morning.
2. Hyperkalemia, improving but potassium is still 5.9. Recheck with the morning labs.
3. Hyperlipidemia: continue atorvastatin 40 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6388766",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-06-07T20:20:00Z",
    "admitted": "2024-06-07T23:28:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-06-08T12:25:00Z",
    "bp": { "systolic_mmhg": 128, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 100,
    "resp_rate_per_min": 20,
    "temp_f": 98.6,
    "spo2_pct": 95,
    "weight_kg": 86.2
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
    "accession": "L24160-8371",
    "collected": "2024-06-08T11:05:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.9",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "24",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.73",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "37",
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
    "started": "2024-06-07T21:10:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
