---
folio: "0.1"
id: "01K5J5EZY0KJVM4XXGJDXEBRJ5"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00546055"
effective: "2025-09-18T00:53:00Z"
effective_end: "2025-09-19T18:30:00Z"
recorded: "2025-09-19T23:38:00Z"
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

**Reason for admission:** acute kidney injury with hyperkalemia.

**Hospital course.** The patient came in with a creatinine of 3.28 and a potassium of 6.3 and was treated with calcium gluconate and IV saline. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake.</ref> Kidney function improved steadily with fluids. The <ref id="dx_aki">acute kidney injury has resolved</ref> to the point of discharge, and the hyperkalemia has also resolved.

**Discharge data.** Vitals at 10:30: BP 118/71, HR 86, RR 16, T 98.8 F, SpO2 96%. Basic metabolic panel on 9/19 at 06:21: sodium 138, potassium 5.0, chloride 101, bicarbonate 23, anion gap 14, urea nitrogen 23, creatinine 1.52 (H), eGFR 49 (L), glucose 163 (H).

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>
- Empagliflozin 10 mg daily: continue
- Amlodipine 5 mg daily: continue
- <ref id="med_losartan">Losartan 100 mg daily: held; her primary care physician will decide on restarting after a repeat BMP</ref>
- <ref id="med_chlorthalidone">Chlorthalidone 12.5 mg (half of a 25 mg tablet) daily: held; her primary care physician will decide after a repeat BMP</ref>

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and to decide on restarting the held blood pressure medicines.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6488440",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-09-17T19:34:00Z",
    "admitted": "2025-09-18T00:53:00Z",
    "discharged": "2025-09-19T18:30:00Z",
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
    "taken": "2025-09-19T15:30:00Z",
    "bp": { "systolic_mmhg": 118, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 86,
    "resp_rate_per_min": 16,
    "temp_f": 98.8,
    "spo2_pct": 96,
    "weight_kg": 108.5
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25262-2564",
    "collected": "2025-09-19T11:21:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "14", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "23", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.52",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "49",
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
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide on restarting after a repeat BMP"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide after a repeat BMP"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
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
