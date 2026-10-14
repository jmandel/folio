---
folio: "0.1"
id: "01GACQTH907D84EB210WHANT6H"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00517408"
effective: "2022-08-09T22:36:00Z"
effective_end: "2022-08-13T18:15:00Z"
recorded: "2022-08-13T23:15:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis.** <ref id="dx_pneumonia">Community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient was admitted with pneumonia, treated in the hospital, and improved steadily. Cough settled and breathing became comfortable. Kidney function, which was abnormal on arrival, improved over the stay. Vitals on the day of discharge at 10:15: BP 122/73, HR 99, RR 20, T 98.9 F, SpO2 98%.

**Results.** Basic metabolic panel on 8/13 at 06:27: sodium 138, potassium 3.9, chloride 101, bicarbonate 22, anion gap 15, urea nitrogen 22, creatinine 1.38 (H), eGFR 57 (L), glucose 153 (H).

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_losartan">Losartan 100 mg by mouth daily: continue</ref>
- Chlorthalidone 12.5 mg (half of a 25 mg tablet) by mouth daily: continue
- Atorvastatin 40 mg by mouth nightly: continue

**Follow-up.** See primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient was encouraged to return sooner for worsening breathing, fever, or any new concern.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6944313",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-08-09T18:20:00Z",
    "admitted": "2022-08-09T22:36:00Z",
    "discharged": "2022-08-13T18:15:00Z",
    "disposition": "home"
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-08-13T15:15:00Z",
    "bp": { "systolic_mmhg": 122, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 20,
    "temp_f": 98.9,
    "spo2_pct": 98,
    "weight_kg": 86.9
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L22225-2826",
    "collected": "2022-08-13T11:27:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "15", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.38",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "57",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "153",
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
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
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Recheck symptoms and chest exam"
  }
}
```
