---
folio: "0.1"
id: "01KG8JS4X0BFSCPB3F2W5EKNQ9"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00450813"
effective: "2026-01-27T08:50:00Z"
effective_end: "2026-01-30T17:45:00Z"
recorded: "2026-01-30T23:11:00Z"
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

**Diagnosis:** <ref id="dx_dka">euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated, resolved</ref>.

**Hospital course.** The patient was admitted from the ED with a profound anion gap acidosis and a glucose of only 219. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. The ketoacidosis was treated with an insulin infusion and dextrose-containing fluids, followed by subcutaneous basal insulin, and the acidosis cleared. Endocrinology saw the patient during the stay.

**Condition at discharge.** Vitals on the morning of discharge at 08:45: BP 134/80, HR 82, RR 21, T 98.6 F, SpO2 97%. The patient is eating, comfortable and breathing easily. On the 06:22 panel on 1/30, sodium was 131, potassium 4.1, chloride 104, bicarbonate 23, anion gap 4, urea nitrogen 25, creatinine 1.26, eGFR 61 and glucose 151.

**Allergies:** none known.

**Discharge medications**

- <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily: do not resume until reviewed by the PCP</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>
- <ref id="med_lisinopril">Lisinopril 40 mg daily: continue</ref>
- Amlodipine 5 mg daily: continue
- Atorvastatin 40 mg nightly: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week, to decide whether dapagliflozin should be restarted and to recheck a basic metabolic panel. The patient was advised to return for nausea, vomiting, abdominal pain or fast breathing.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6805361",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-01-27T05:41:00Z",
    "admitted": "2026-01-27T08:50:00Z",
    "discharged": "2026-01-30T17:45:00Z",
    "disposition": "home"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-01-30T14:45:00Z",
    "bp": { "systolic_mmhg": 134, "diastolic_mmhg": 80 },
    "heart_rate_bpm": 82,
    "resp_rate_per_min": 21,
    "temp_f": 98.6,
    "spo2_pct": 97,
    "weight_kg": 82.1
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L26030-0376",
    "collected": "2026-01-30T12:22:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.1", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
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
        "value": "25",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.26",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "61",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "151",
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
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
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
    "purpose": "Decide whether to restart dapagliflozin; recheck basic metabolic panel"
  }
}
```
