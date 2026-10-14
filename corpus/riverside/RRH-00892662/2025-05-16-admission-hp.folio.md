---
folio: "0.1"
id: "01JVE0FJB0KWC40NTT7VATAR2M"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00892662"
effective: "2025-05-17T00:08:00Z"
recorded: "2025-05-17T02:17:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient is seen on the medical floor after evaluation in the ED this afternoon. They have had back pain for several days and have been taking over-the-counter pain medicine for it, with little to drink. They felt weak and thirsty and came in for evaluation. Labs drawn at 15:22 showed potassium 6.0, creatinine 1.87 and sodium 130. In the ED they received calcium gluconate 1 g IV, and a saline bolus was started at 15:55.

**Medications at home:** lisinopril 40 mg daily and rosuvastatin 20 mg nightly.

**Allergies:** no known drug allergies.

**Exam.** Vitals at 18:58: BP 121/73, HR 111, RR 23, T 98.5 F, SpO2 98%. Tachycardic, mildly dry mucous membranes, lungs clear, abdomen soft. Back is tender over the paraspinal muscles without focal deficit.

**Results.** 15:22 panel: sodium 130, potassium 6.0, bicarbonate 22, urea nitrogen 42, creatinine 1.87, eGFR 30, glucose 186.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake.</ref> Continue normal saline at 125 mL/h after the bolus. Avoid nephrotoxins. Repeat BMP in the morning.
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.0 on arrival and treated with calcium gluconate in the ED. Recheck potassium with the morning labs and keep on telemetry.
3. Hypertension: BP is acceptable tonight. <ref id="med_lisinopril">Hold lisinopril until creatinine is back to baseline.</ref>
4. Continue rosuvastatin 20 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6155199",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-05-16T20:05:00Z",
    "admitted": "2025-05-16T23:10:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-05-16T23:58:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 111,
    "resp_rate_per_min": 23,
    "temp_f": 98.5,
    "spo2_pct": 98,
    "weight_kg": 69.2
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "dx_hyperk": {
    "type": "diagnosis",
    "label": "Hyperkalemia",
    "icd10cm": "E87.5",
    "status": "active",
    "rank": "secondary"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25136-5109",
    "collected": "2025-05-16T20:22:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "130",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.0",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "5",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "42",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.87",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "30",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "186",
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
    "started": "2025-05-16T20:55:00Z"
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
    "restart_advice": "resume_when_able",
    "instructions": "Hold until creatinine back to baseline"
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
