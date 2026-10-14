---
folio: "0.1"
id: "01KDPJRMQ0H1GNMYC7XC13HM81"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00449604"
effective: "2025-12-30T00:41:00Z"
recorded: "2025-12-30T02:53:00Z"
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

**Reason for admission:** pneumonia acquired in the community, needing inpatient treatment and monitoring.

**History of present illness.** The patient was seen in the ED today with several days of cough, tiredness and reduced appetite, and was brought up to the medical floor for intravenous fluids and monitoring. No known drug allergies.

**Home medications.** Lisinopril 20 mg daily and atorvastatin 20 mg nightly. The patient also takes metformin 1000 mg twice daily with meals and empagliflozin 10 mg daily; see the plan below.

**Allergies:** NKDA.

**Exam.** Vitals at 18:31: BP 116/70, HR 108, RR 24, T 98 F, SpO2 99%. The patient looks tired but is in no acute distress and is breathing a little faster than normal. Abdomen soft and non-tender.

**Results.** The basic metabolic panel drawn at 15:23 showed sodium 131 (L), potassium 4.7, chloride 97 (L), bicarbonate 19 (L), anion gap 15, urea nitrogen 48 (H), creatinine 1.09 (H), eGFR 56 (L) and glucose 153 (H).

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, active. Normal saline has been running at 75 mL/h since 15:38. We will keep watching breathing, oxygen saturation and heart rate through the night.
2. Diabetes medications: <ref id="med_metformin">hold metformin during the acute illness</ref>, to be resumed when able. <ref id="med_empagliflozin">Hold empagliflozin while not eating</ref>, also to be resumed when able.
3. Continue lisinopril and atorvastatin as at home.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6022676",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-12-29T20:48:00Z",
    "admitted": "2025-12-29T23:57:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-12-30T00:31:00Z",
    "bp": { "systolic_mmhg": 116, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 108,
    "resp_rate_per_min": 24,
    "temp_f": 98,
    "spo2_pct": 99,
    "weight_kg": 89.5
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25363-4629",
    "collected": "2025-12-29T21:23:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "131",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.7", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "97",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "19",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "15", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "48",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.09",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "56",
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
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "75 mL/h",
    "started": "2025-12-29T21:38:00Z"
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
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold during acute illness"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while not eating"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
