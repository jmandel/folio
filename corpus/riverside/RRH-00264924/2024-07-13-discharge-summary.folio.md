---
folio: "0.1"
id: "01J2PQ1XQ01HN6B0CW2YZBJKB8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00264924"
effective: "2024-07-12T03:12:00Z"
effective_end: "2024-07-13T15:15:00Z"
recorded: "2024-07-13T18:53:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Hospital course.** The patient was admitted with acute kidney injury and hyperkalemia. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake.</ref> Potassium was 6.7 on arrival and was treated with IV calcium and saline. With continued saline, potassium fell and kidney function recovered. The hyperkalemia has resolved.

**Condition at discharge.** <ref id="dx_aki">Acute kidney injury has resolved</ref>. Vitals at 07:15: BP 119/71, HR 104, RR 23, temperature 99 F, SpO2 94%. The patient is eating and drinking and feels well.

**Discharge labs.** BMP at 06:21: sodium 133, potassium 5.3, chloride 104, bicarbonate 21, anion gap 8, urea nitrogen 30, creatinine 1.05, eGFR 85, glucose 132.

**Allergies:** no known drug allergies.

**Discharge medications**

- Amlodipine 5 mg by mouth daily, continue
- Atorvastatin 40 mg by mouth nightly, continue
- Levothyroxine 75 mcg by mouth daily, continue
- Lisinopril 10 mg daily: <ref id="med_lisinopril">held; the primary care physician will decide on restarting after a repeat BMP</ref>

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision about restarting the held blood pressure medicine.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6553794",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-07-11T21:34:00Z",
    "admitted": "2024-07-12T03:12:00Z",
    "discharged": "2024-07-13T15:15:00Z",
    "disposition": "home"
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "resolved",
    "rank": "principal"
  },
  "dx_hyperk": {
    "type": "diagnosis",
    "label": "Hyperkalemia",
    "icd10cm": "E87.5",
    "status": "resolved",
    "rank": "secondary"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-07-13T12:15:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 104,
    "resp_rate_per_min": 23,
    "temp_f": 99,
    "spo2_pct": 94,
    "weight_kg": 80.8
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24195-6207",
    "collected": "2024-07-13T11:21:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "133",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.05",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "85",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "132",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
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
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide on restarting after a repeat BMP"
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
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
