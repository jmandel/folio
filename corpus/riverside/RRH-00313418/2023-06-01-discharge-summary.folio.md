---
folio: "0.1"
id: "01H1WAYRN07QYGDYY7P443S7SG"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00313418"
effective: "2023-05-28T09:47:00Z"
effective_end: "2023-06-01T15:15:00Z"
recorded: "2023-06-01T20:39:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnoses.** <ref id="dx_aki">Acute kidney injury, resolved.</ref> Hyperkalemia, resolved. Hyponatremia, resolved.

**Hospital course.** The patient presented with several days of diarrhea and was found to have a potassium of 6.5, sodium 129 and creatinine 1.89. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> Calcium gluconate 1 g IV was given once in the ED, and normal saline was given as a bolus and then 125 mL/h until 5/29 at 04:47. Kidney function and sodium recovered steadily. Lisinopril and chlorthalidone were held throughout the stay. No known drug allergies.

**Condition at discharge.** Vitals at 07:15: BP 129/77, HR 98, RR 17, T 98.8 F, SpO2 99%. The patient is eating well, with normal stools, and is comfortable.

**Results at discharge.** On the 6/1 06:28 panel: sodium 136, potassium 5.2, chloride 103, bicarbonate 25, anion gap 8, urea nitrogen 30, creatinine 0.85, eGFR 72 and glucose 163. Creatinine has returned to normal; potassium is only slightly above the reference range.

**Home medications held at discharge**

- Lisinopril 40 mg daily: <ref id="med_lisinopril">held; PCP to decide on restarting after a repeat BMP</ref>.
- Chlorthalidone 12.5 mg (half of a 25 mg tablet) daily: <ref id="med_chlorthalidone">held; PCP to decide after a repeat BMP</ref>.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision on restarting the held blood pressure medicines. The patient should drink fluids well and return for worsening diarrhea, weakness or reduced urination.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6774262",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-05-28T03:41:00Z",
    "admitted": "2023-05-28T09:47:00Z",
    "discharged": "2023-06-01T15:15:00Z",
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
    "taken": "2023-06-01T12:15:00Z",
    "bp": { "systolic_mmhg": 129, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 98,
    "resp_rate_per_min": 17,
    "temp_f": 98.8,
    "spo2_pct": 99,
    "weight_kg": 95.7
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23152-5516",
    "collected": "2023-06-01T11:28:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.2",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
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
        "value": "0.85",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "72",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
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
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Repeat BMP; decide on restarting held blood pressure medicines"
  }
}
```
