---
folio: "0.1"
id: "01KDBH2WR016AD7PYKVEX90W9W"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00324781"
effective: "2025-12-22T02:23:00Z"
effective_end: "2025-12-25T16:45:00Z"
recorded: "2025-12-25T19:52:00Z"
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

**Hospital course.** The patient was admitted with four days of diarrhea, weakness, a potassium of 6.5 and a creatinine of 1.70. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> They received IV calcium gluconate in the ED and then normal saline, which was stopped on the evening of 12/22. Hyperkalemia resolved. The <ref id="dx_aki">acute kidney injury resolved</ref>. The diarrhea stopped and the patient is eating and drinking normally.

**Condition at discharge.** Stable. Vitals this morning at 07:45: BP 133/80, HR 109, RR 20, temperature 98.3 F, SpO2 95%.

**Discharge labs.** Basic metabolic panel 12/25 at 06:23: sodium 134, potassium 5.2, chloride 100, bicarbonate 24, anion gap 10, urea nitrogen 19, creatinine 0.80, eGFR 79, glucose 134. Potassium is still slightly high but much improved.

**Allergies:** NKDA.

**Discharge medications**

- Lisinopril 20 mg daily: <ref id="med_lisinopril">remains on hold; the PCP will decide on restarting after a repeat BMP.</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue.</ref>
- Atorvastatin 20 mg nightly: continue.

**Follow-up.** See primary care at Northgate Family Medicine within 1 week for a repeat BMP and to decide on restarting the held blood pressure medicines. The patient should return for worsening diarrhea, poor intake, weakness, or palpitations.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6577647",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-12-21T22:12:00Z",
    "admitted": "2025-12-22T02:23:00Z",
    "discharged": "2025-12-25T16:45:00Z",
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
    "taken": "2025-12-25T13:45:00Z",
    "bp": { "systolic_mmhg": 133, "diastolic_mmhg": 80 },
    "heart_rate_bpm": 109,
    "resp_rate_per_min": 20,
    "temp_f": 98.3,
    "spo2_pct": 95,
    "weight_kg": 86.1
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25359-6682",
    "collected": "2025-12-25T12:23:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "134",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.2",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "19", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.80",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "79",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "134",
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
    "drug_name": "metformin 500 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "500 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "prescriber_decides",
    "instructions": "PCP to decide on restarting after a repeat BMP"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
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
