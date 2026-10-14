---
folio: "0.1"
id: "01JATRT290FREFK0X7JX7PZ5MZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00529403"
effective: "2024-10-22T13:45:00-05:00"
recorded: "2024-10-22T13:46:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

<ref id="referral">Referring for CKD evaluation and management. eGFR 35 and UACR 162 mg/g.</ref>

Pt has type 2 diabetes and essential hypertension, and I saw them today as a new patient to establish care. Please see them and advise on the work-up and ongoing kidney care. Recent labs are available on request.

Thank you for seeing this patient.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1751",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 35, UACR 162 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1751",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1751",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1751",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
