---
folio: "0.1"
id: "01GXR996T0DE3MGH6XQYX3HEXT"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00425415"
effective: "2023-04-11T12:46:00Z"
recorded: "2023-04-11T13:50:00Z"
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

**Interval history.** The patient slept well and reports feeling much better. Diarrhea has settled and appetite is returning. Saline was stopped at 01:36.

**Exam.** Vitals at 07:26: BP 140/84, HR 94, RR 18, T 98.9 F, SpO2 95%. The patient is comfortable, mucous membranes are moist, and lungs are clear.

**Results.** On the 06:06 panel: <ref id="bmp">sodium 138, potassium 5.5 (H), chloride 99, bicarbonate 25, anion gap 14, urea nitrogen 27 (H), creatinine 1.98 (H), eGFR 43 (L), glucose 139 (H)</ref>. The anion gap and bicarbonate have normalized, and the potassium is coming down but is still above normal.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref> is improving: creatinine down from 2.55 on admission to 1.98 with fluids. Continue to follow daily chemistries and encourage oral fluids.
2. Potassium remains mildly elevated at 5.5 and will be rechecked with tomorrow's labs.
3. Hyperlipidemia: continue rosuvastatin 20 mg nightly.

Allergies: NKDA.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6413280",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-04-10T01:55:00Z",
    "admitted": "2023-04-10T06:36:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-04-11T12:26:00Z",
    "bp": { "systolic_mmhg": 140, "diastolic_mmhg": 84 },
    "heart_rate_bpm": 94,
    "resp_rate_per_min": 18,
    "temp_f": 98.9,
    "spo2_pct": 95,
    "weight_kg": 101.3
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
    "accession": "L23101-6651",
    "collected": "2023-04-11T11:06:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.5",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "27",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.98",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "43",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "139",
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
    "started": "2023-04-10T02:45:00Z",
    "stopped": "2023-04-11T06:36:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
