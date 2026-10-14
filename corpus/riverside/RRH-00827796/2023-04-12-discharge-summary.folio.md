---
folio: "0.1"
id: "01GXW37630HYEJYZ8WXWG05528"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00827796"
effective: "2023-04-09T08:49:00Z"
effective_end: "2023-04-12T20:45:00Z"
recorded: "2023-04-13T01:21:00Z"
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

**Hospital course.** The patient was admitted with hyperkalemia and acute kidney injury. Potassium was 6.8 and creatinine 2.89 on arrival. <ref id="precipitant">Acute kidney injury attributed to several days of over-the-counter naproxen for back pain on top of an ARB and diuretic, with poor fluid intake</ref>. Treatment was IV saline, and the home blood pressure and diabetes medicines were held. Kidney function improved steadily, and the hyperkalemia resolved.

**Condition at discharge.** Vitals at 12:45: BP 123/74, HR 103, RR 16, temperature 99.1 F, SpO2 95%. The patient is eating and drinking. On the 4/12 06:21 panel sodium was 133 (L), potassium 5.6 (H), chloride 100, bicarbonate 22, anion gap 11, urea nitrogen 29 (H), creatinine 1.63 (H), eGFR 47 and glucose 107 (H). The <ref id="dx_aki">acute kidney injury is resolved</ref>, with creatinine down from 2.89 to 1.63.

**Allergies:** lisinopril (cough).

**Medications at discharge**

- Metformin 1000 mg tablet, 1 tablet by mouth twice daily with meals: <ref id="med_metformin">continue</ref>.
- Losartan 50 mg tablet, 1 tablet by mouth daily: <ref id="med_losartan">held; PCP to decide on restarting after a repeat BMP</ref>.
- Hydrochlorothiazide 25 mg tablet, 1 tablet by mouth daily: <ref id="med_hydrochlorothiazide">held; PCP to decide after a repeat BMP</ref>.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision on restarting the held blood pressure medicines.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6281782",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-04-09T03:55:00Z",
    "admitted": "2023-04-09T08:49:00Z",
    "discharged": "2023-04-12T20:45:00Z",
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
    "taken": "2023-04-12T17:45:00Z",
    "bp": { "systolic_mmhg": 123, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 103,
    "resp_rate_per_min": 16,
    "temp_f": 99.1,
    "spo2_pct": 95,
    "weight_kg": 82.4
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23102-4163",
    "collected": "2023-04-12T11:21:00Z",
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
        "value": "5.6",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "29",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.63",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "47",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "107",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "cough",
    "severity": "mild"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
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
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide after a repeat BMP"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
