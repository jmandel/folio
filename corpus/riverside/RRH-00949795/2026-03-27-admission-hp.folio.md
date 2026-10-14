---
folio: "0.1"
id: "01KMQ4SMT0XDHQNXJ4TTCJC2KV"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00949795"
effective: "2026-03-27T05:56:00Z"
recorded: "2026-03-27T07:58:00Z"
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

**Reason for admission:** community-acquired pneumonia with reduced kidney function.

**History of present illness.** The patient was seen in the ED yesterday evening with cough, low-grade fever and exertional breathlessness over the past several days, and has eaten and drunk little during that time. In the ED the chest findings and white count pointed to <ref id="dx_pneumonia">community-acquired pneumonia</ref>. Creatinine was 1.67 with urea nitrogen 54, felt to reflect dehydration. Normal saline at 75 mL/h was started at 18:45 and continues. Allergies: NKDA.

**Exam.** Vitals at 00:46: BP 107/64, HR 107, RR 19, T 98.8 F, SpO2 98%. Tired but comfortable. Mild tachycardia. Crackles at the lung base, no increased work of breathing. Abdomen soft.

**Results.** Basic metabolic panel drawn 3/26 at 18:26: sodium 138, potassium 4.4, chloride 105, bicarbonate 21 (L), anion gap 12, urea nitrogen 54 (H), creatinine 1.67 (H), eGFR 34 (L), glucose 163 (H).

**Assessment and plan**

1. Community-acquired pneumonia: continue the treatment started in the ED, monitor oxygen saturation and respiratory rate, and reassess in the morning.
2. Dehydration with reduced kidney function: continue IV fluids and repeat the basic metabolic panel in the morning. Avoid nephrotoxic drugs.
3. Diabetes medications: <ref id="med_metformin">hold metformin during the acute illness</ref>, given the kidney function and poor intake. <ref id="med_empagliflozin">Hold empagliflozin while he is not eating</ref>. Both can be resumed when able.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6532872",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-03-26T22:55:00Z",
    "admitted": "2026-03-27T04:36:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-03-27T05:46:00Z",
    "bp": { "systolic_mmhg": 107, "diastolic_mmhg": 64 },
    "heart_rate_bpm": 107,
    "resp_rate_per_min": 19,
    "temp_f": 98.8,
    "spo2_pct": 98,
    "weight_kg": 70.5
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
    "accession": "L26085-3414",
    "collected": "2026-03-26T23:26:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "54",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.67",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "34",
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
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "75 mL/h",
    "started": "2026-03-26T23:45:00Z"
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
  }
}
```
