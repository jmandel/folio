---
folio: "0.1"
id: "01J92HQGF0BW09DZ0YQH6MA43P"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00357349"
effective: "2024-09-27T04:46:00Z"
effective_end: "2024-09-30T18:15:00Z"
recorded: "2024-09-30T22:45:00Z"
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

**Diagnosis:** <ref id="dx_pneumonia">Community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient presented to the ED on 9/26 with several days of productive cough, low-grade fever and tiredness. The white count was elevated, the exam showed crackles at the right base, and the chemistry panel showed a low sodium of 131, urea nitrogen 47 and creatinine 1.17, consistent with volume depletion. Treatment was started with ceftriaxone and normal saline, and the patient was admitted. Metformin and losartan were held during the acute illness. Fever and cough settled over the next days, breathing returned to baseline, and oral intake recovered. IV fluids were stopped on 9/27 at 23:46. Kidney function and sodium normalized with hydration.

**Discharge data.** Vitals on the day of discharge at 10:15: BP 127/76, HR 90, RR 24, T 98.8 F, SpO2 99%. The patient was comfortable at rest. The basic metabolic panel on 9/30 at 06:22 showed sodium 136, potassium 3.9, chloride 100, bicarbonate 24, anion gap 12, urea nitrogen 24 (H), creatinine 0.92, eGFR 61 and glucose 115 (H). Creatinine is back to baseline.

**Allergies:** no known drug allergy.

**Medications at discharge**

- <ref id="med_losartan">Losartan 50 mg tablet, 1 tablet by mouth daily: continue</ref>
- <ref id="med_metformin">Metformin 500 mg tablet, 1 tablet by mouth twice daily with meals: continue</ref>

Both home medications were held while the patient was acutely ill and are to be taken again as listed now that creatinine has returned to baseline.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week, to recheck symptoms and the chest exam. The patient should return sooner for worsening cough, fever, shortness of breath or inability to keep fluids down.

**Condition at discharge:** stable and improved. Instructions were reviewed with the patient, who voiced understanding.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6327873",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-09-26T23:20:00Z",
    "admitted": "2024-09-27T04:46:00Z",
    "discharged": "2024-09-30T18:15:00Z",
    "disposition": "home"
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-09-30T15:15:00Z",
    "bp": { "systolic_mmhg": 127, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 90,
    "resp_rate_per_min": 24,
    "temp_f": 98.8,
    "spo2_pct": 99,
    "weight_kg": 78.5
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24274-6218",
    "collected": "2024-09-30T11:22:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "100", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "24",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.92",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "61",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "115",
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Recheck symptoms and chest exam"
  }
}
```
