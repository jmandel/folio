---
folio: "0.1"
id: "01H39673P0KZDNT0QWKK0RNH6X"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00305402"
effective: "2023-06-19T04:52:00Z"
recorded: "2023-06-19T06:42:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** acute kidney injury with hyperkalemia.

**History of present illness.** The patient was sent up from the ED after labs this evening showed a high potassium and a creatinine well above normal. They had four days of watery diarrhea with poor intake and a sense of light-headedness on standing. There has been no chest pain, no fever and no urinary complaints. They have no known drug allergies (NKDA).

**Exam.** Vitals at 23:42: BP 107/64, HR 84, RR 21, T 98.8 F, SpO2 98%. Comfortable and conversant. Mucous membranes slightly dry. Heart regular, lungs clear, abdomen soft and non-tender.

**Results.** On the 17:58 panel sodium was 129, potassium 6.3, bicarbonate 22, urea nitrogen 34, creatinine 1.89 with eGFR 32, and glucose 209. Saline began at 18:24 and is still running.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>. <ref id="precipitant">AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.</ref> Continue the saline at 125 mL/h after the bolus, strict intake and output, and repeat BMP in the morning. <ref id="med_losartan">Hold losartan until creatinine is back to baseline.</ref>
2. <ref id="dx_hyperk">Hyperkalemia</ref>, potassium 6.3 on arrival, treated in the ED with calcium. Recheck potassium with the morning labs and keep on telemetry overnight.
3. Hyponatremia, sodium 129, most likely from volume loss. Expect it to improve with fluids; follow on the repeat panel.
4. Type 2 diabetes: glucose 209. <ref id="med_metformin">Hold metformin during the acute illness.</ref>
5. Continue atorvastatin 40 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6441424",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-06-18T22:34:00Z",
    "admitted": "2023-06-19T04:11:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-06-19T04:42:00Z",
    "bp": { "systolic_mmhg": 107, "diastolic_mmhg": 64 },
    "heart_rate_bpm": 84,
    "resp_rate_per_min": 21,
    "temp_f": 98.8,
    "spo2_pct": 98,
    "weight_kg": 70.1
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
    "accession": "L23169-1695",
    "collected": "2023-06-18T22:58:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "129",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "HH"
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
        "value": "4",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "34",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.89",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "32",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "209",
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
    "started": "2023-06-18T23:24:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold until creatinine back to baseline"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
