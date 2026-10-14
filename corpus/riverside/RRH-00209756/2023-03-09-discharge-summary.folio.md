---
folio: "0.1"
id: "01GV4EG6V097PWW2GFAVBSNAKA"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00209756"
effective: "2023-03-07T02:01:00Z"
effective_end: "2023-03-09T20:00:00Z"
recorded: "2023-03-10T00:25:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**Hospital course.** The patient came in with high potassium and abnormal kidney function. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake</ref>. They were treated with IV fluids and monitored on telemetry. Hyperkalemia resolved. <ref id="dx_aki">Acute kidney injury resolved</ref> to near baseline with fluids and avoiding anti-inflammatory drugs. At the first visit, vitals were BP 128/77, HR 103, RR 24, T 98.7 F, SpO2 94%.

**Results at discharge.** BMP on 3/9 at 06:30: sodium 135, potassium 5.3, chloride 99, bicarbonate 26, anion gap 10, urea nitrogen 27, creatinine 1.54, eGFR 41, glucose 151.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_losartan">Losartan 50 mg daily remains on hold; the primary care physician will decide on restarting after a repeat BMP</ref>.
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>.
- Glipizide 5 mg daily: continue.
- Atorvastatin 40 mg nightly: continue.

**Instructions.** Do not take naproxen or similar over-the-counter anti-inflammatory medicines. Drink fluids regularly. Return for weakness, palpitations, very little urine or vomiting that will not stop.

**Follow-up.** Northgate Family Medicine within 1 week for a repeat BMP and a decision on restarting the held blood pressure medicines.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6739258",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-03-06T22:34:00Z",
    "admitted": "2023-03-07T02:01:00Z",
    "discharged": "2023-03-09T20:00:00Z",
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
    "taken": "2023-03-09T17:00:00Z",
    "bp": { "systolic_mmhg": 128, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 103,
    "resp_rate_per_min": 24,
    "temp_f": 98.7,
    "spo2_pct": 94,
    "weight_kg": 81.7
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23068-3751",
    "collected": "2023-03-09T12:30:00Z",
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
        "value": "5.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "27",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.54",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "41",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "151",
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
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide on restarting after a repeat BMP"
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
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
