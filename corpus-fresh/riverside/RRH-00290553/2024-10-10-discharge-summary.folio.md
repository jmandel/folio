---
folio: "0.1"
id: "01J9WC3KD02F87084MPT7Q8RV1"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00290553"
effective: "2024-10-09T01:06:00Z"
effective_end: "2024-10-10T20:15:00Z"
recorded: "2024-10-10T23:27:00Z"
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

**Hospital course.** The patient was admitted with a creatinine of 3.19 and a potassium of 6.4 after several days of poor intake and back pain treated with over-the-counter naproxen. <ref id="dx_aki">The acute kidney injury has resolved</ref> with IV fluids. <ref id="precipitant">AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake.</ref> The hyperkalemia also resolved. The patient was comfortable throughout, with vitals on 10/8 at 12:15 of BP 121/73, HR 109, RR 23, T 99 F, SpO2 97%.

**Results at discharge.** BMP drawn 10/10 at 06:00: sodium 138, potassium 5.1, chloride 99, bicarbonate 21 (L), anion gap 18 (H), urea nitrogen 18, creatinine 1.82, eGFR 30, glucose 117.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_lisinopril">Lisinopril 20 mg daily: remains on hold; the PCP will decide on restarting after a repeat BMP.</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue.</ref>
- Dapagliflozin 10 mg daily: continue.
- Atorvastatin 20 mg nightly: continue.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week for a repeat BMP and a decision on restarting the held blood pressure medicine. The patient should avoid naproxen and similar over-the-counter pain relievers and should keep up fluids.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6071584",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-10-08T22:05:00Z",
    "admitted": "2024-10-09T01:06:00Z",
    "discharged": "2024-10-10T20:15:00Z",
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
    "taken": "2024-10-10T17:15:00Z",
    "bp": { "systolic_mmhg": 121, "diastolic_mmhg": 73 },
    "heart_rate_bpm": 109,
    "resp_rate_per_min": 23,
    "temp_f": 99,
    "spo2_pct": 97,
    "weight_kg": 84
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24284-9742",
    "collected": "2024-10-10T11:00:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.1", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "18",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.82",
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
        "value": "117",
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
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
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
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 50 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "50 mg",
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
