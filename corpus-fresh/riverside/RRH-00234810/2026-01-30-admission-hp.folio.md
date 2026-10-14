---
folio: "0.1"
id: "01KG9J2QP0GNXW1N3SH2KC2F2Q"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00234810"
effective: "2026-01-31T05:52:00Z"
recorded: "2026-01-31T08:18:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** pneumonia, acquired in the community.

**History.** The patient presented to the ED this afternoon with cough and shortness of breath and was found to have findings consistent with pneumonia. Home medications were reviewed on arrival. Allergies: NKDA.

**Home medications.** Insulin glargine 10 units SubQ nightly and atorvastatin 20 mg nightly are continued. Metformin 1000 mg twice daily with meals and empagliflozin 10 mg daily are on the home list.

**Exam.** Vitals at 23:42: BP 121/73, HR 82, RR 19, T 98.9 F, SpO2 96%. Comfortable at rest, speaking in full sentences, with no distress.

**Results.** The basic metabolic panel drawn at 17:50 showed sodium 131, potassium 4.5, chloride 103, bicarbonate 18, anion gap 10, urea nitrogen 60, creatinine 1.98 with eGFR 30, and glucose 180.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia.</ref> Admitted to the hospitalist service. Normal saline continues at 75 mL/h, started at 18:24. Repeat labs in the morning.
2. Diabetes: continue home glargine 10 units nightly. <ref id="med_metformin">Hold metformin during the acute illness.</ref> <ref id="med_empagliflozin">Hold empagliflozin while not eating.</ref> Both are to be resumed when able.
3. Abnormal chemistry: sodium, bicarbonate and kidney numbers as above; recheck with the morning panel while fluids run.
4. Hyperlipidemia: continue atorvastatin 20 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6398122",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-01-30T23:34:00Z",
    "admitted": "2026-01-31T04:53:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-01-31T05:42:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 82,
    "resp_rate_per_min": 19,
    "temp_f": 98.9,
    "spo2_pct": 96,
    "weight_kg": 83
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
    "accession": "L26030-6219",
    "collected": "2026-01-30T23:50:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.5", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "60",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.98",
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
        "value": "180",
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
    "started": "2026-01-31T00:24:00Z"
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
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
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
