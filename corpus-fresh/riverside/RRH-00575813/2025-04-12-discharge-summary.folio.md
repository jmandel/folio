---
folio: "0.1"
id: "01JRP10BF0HVEJ577E9NX2A3CJ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00575813"
effective: "2025-04-10T07:49:00Z"
effective_end: "2025-04-12T18:00:00Z"
recorded: "2025-04-12T22:13:00Z"
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

**Hospital course.** The patient was admitted with acute kidney injury and hyperkalemia. They were treated with calcium gluconate in the ED and intravenous saline, with steady improvement in kidney function. Hyperkalemia is documented as resolved. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref>

**Diagnosis at discharge.** <ref id="dx_aki">Acute kidney injury, resolved.</ref>

**Condition at discharge.** Vitals on the day of discharge at 10:00: BP 126/76, HR 91, RR 22, T 98.3 F, SpO2 97%. The last basic metabolic panel, drawn 4/12 at 06:26, showed sodium 139, potassium 5.6 (H), chloride 102, bicarbonate 26, anion gap 11, urea nitrogen 25 (H), creatinine 0.97, eGFR 59 (L) and glucose 158 (H). The potassium is still slightly high and will be rechecked. Allergies: NKDA.

**Discharge medications**

- Empagliflozin 10 mg by mouth daily: continue
- Carvedilol 12.5 mg by mouth twice daily: continue
- Levothyroxine 75 mcg by mouth daily: continue
- <ref id="med_furosemide">Furosemide 40 mg daily: held; the primary care physician will decide after a repeat BMP</ref>
- <ref id="med_losartan">Losartan 50 mg daily: held; the primary care physician will decide on restarting after a repeat BMP</ref>
- <ref id="med_spironolactone">Spironolactone 25 mg daily: stopped</ref>

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision on restarting the held blood pressure medicines. The patient was advised to drink fluids normally and to return for lightheadedness, markedly reduced urination, or recurrent diarrhea.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6531901",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-04-10T04:48:00Z",
    "admitted": "2025-04-10T07:49:00Z",
    "discharged": "2025-04-12T18:00:00Z",
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
    "taken": "2025-04-12T15:00:00Z",
    "bp": { "systolic_mmhg": 126, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 91,
    "resp_rate_per_min": 22,
    "temp_f": 98.3,
    "spo2_pct": 97,
    "weight_kg": 81.2
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25102-3359",
    "collected": "2025-04-12T11:26:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "139", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.6",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "25",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.97",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "59",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "158",
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
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide on restarting after a repeat BMP"
  },
  "med_carvedilol": {
    "type": "home_med",
    "drug_name": "carvedilol 12.5 mg tablet",
    "rxnorm_ingredient": "20352",
    "dose_text": "12.5 mg",
    "sig": "1 tab PO BID",
    "status": "continue"
  },
  "med_spironolactone": {
    "type": "home_med",
    "drug_name": "spironolactone 25 mg tablet",
    "rxnorm_ingredient": "9997",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "stopped"
  },
  "med_furosemide": {
    "type": "home_med",
    "drug_name": "furosemide 40 mg tablet",
    "rxnorm_ingredient": "4603",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide after a repeat BMP"
  },
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
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
